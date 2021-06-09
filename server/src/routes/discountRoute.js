import express from 'express'
import createError from 'http-errors'
import multer from 'multer'
import {promisify} from 'util'
import fs from 'fs'
import del from 'del'
import Discount from '../models/discountModel'
import {isValidId} from '../middlewares/paramsMiddleware'
import {isAuth} from '../middlewares/authMiddleware'
import {isPageLimit} from '../middlewares/paginationMiddleware'
import {commentValidation, updateValidation, createValidation, listValidation} from '../validations/discountValidation'

const router = express.Router()
const upload = multer()
const pipeline = promisify(require('stream').pipeline)

//delete comment (admin can delete every single)
router.delete('/comment/:id/:commentId', isValidId('id', 'commentId'), isAuth, async (req, res, next) => {
    try {
        const possibleAdmin = req.checkedUser.isAdmin

        const commentedDiscount = await Discount.findById(req.params.id, 'comments')
        if(!commentedDiscount) throw createError(404, 'Podana okazja nie istnieje.')

        const deletedCommentIndex = commentedDiscount.comments.findIndex(comment => comment._id==req.params.commentId)
        if(deletedCommentIndex<0) throw createError(404, 'Podany komentarz nie istnieje.')

        if(commentedDiscount.comments[deletedCommentIndex].commentedBy==req.user.id || possibleAdmin) {
            if(commentedDiscount.comments[deletedCommentIndex].deleted===true) throw createError(409, 'Podany komentarz został już usunięty.')

            commentedDiscount.comments[deletedCommentIndex].message = 'Komentarz został usunięty.'
            commentedDiscount.comments[deletedCommentIndex].deleted = true

            await commentedDiscount.save()

            const newCommentedDiscount = await Discount.findById(commentedDiscount._id, 'comments').populate({
                path: 'comments',
                populate: {
                    path: 'commentedBy', 
                    select: 'nick'
                }
            })

            return res.status(200).send(newCommentedDiscount.comments)
        }
        else throw createError(403, 'Brak wystarczających uprawnień.')
    }
    catch(error) {
        return next(error)
    }
})
//create comment
router.post('/comment/:id', isValidId('id'), isAuth, async (req, res, next) => {
    try {
        const validationResult = await commentValidation.validateAsync({message: req.body.message})

        const commentedDiscount = await Discount.findById(req.params.id, 'comments')
        if(!commentedDiscount) throw createError(404, 'Podana okazja nie istnieje.')

        const newComment = {
            commentedBy: req.user.id,
            message: validationResult.message,
            createdAt: new Date()
        }
        commentedDiscount.comments.push(newComment)

        await commentedDiscount.save()

        const newCommentedDiscount = await Discount.findById(commentedDiscount._id, 'comments').populate({
            path: 'comments',
            populate: {
                path: 'commentedBy', 
                select: 'nick'
            }
        })

        return res.status(201).send(newCommentedDiscount.comments)
    }
    catch(error) {
        if(error.isJoi===true) {
            error.status = 422
            error.message = 'Przesłano błędne dane.'
        }
        return next(error)
    }
})
//list discount comments
router.get('/comment/:id', isValidId('id'), async (req, res, next) => {
    try {
        const discount = await Discount.findById(req.params.id, 'comments').populate({
            path: 'comments',
            populate: {
                path: 'commentedBy', 
                select: 'nick'
            }
        })
        if(!discount) throw createError(404, 'Podana okazja nie istnieje.')

        return res.status(200).send(discount.comments)
    } 
    catch(error) {
        return next(error)
    }
})

//unrate discount
router.delete('/rate/:id', isValidId('id'), isAuth, async (req, res, next) => {
    try {
        const unratedDiscount = await Discount.findById(req.params.id, 'ratings')
        if(!unratedDiscount) throw createError(404, 'Podana okazja nie istnieje.')

        const unratingIndex = unratedDiscount.ratings.findIndex(rating => rating.ratedBy==req.user.id)
        if(unratingIndex<0) throw createError(404, 'Podana ocena nie istnieje.')

        let newRatings = unratedDiscount.ratings
        newRatings.splice(unratingIndex, 1)
        unratedDiscount.ratings = newRatings

        await unratedDiscount.save()

        return res.status(200).send({message: 'Usunięto ocenę.', ratings: unratedDiscount.ratings})
    }
    catch(error) {
        return next(error)
    }
})
//rate discount
router.post('/rate/:id', isValidId('id'), isAuth, async (req, res, next) => {
    try {
        if(req.body.rating!==true && req.body.rating!==false) throw createError(422, 'Przesłano błędne dane.')

        const ratedDiscount = await Discount.findById(req.params.id, 'addedBy ratings')
        if(!ratedDiscount) throw createError(404, 'Podana okazja nie istnieje.')

        if(ratedDiscount.addedBy==req.user.id) throw createError(409, 'Nie możesz ocenić swojej okazji.')

        const ratingIndex = ratedDiscount.ratings.findIndex(rating => rating.ratedBy==req.user.id)
        if(ratingIndex>=0) ratedDiscount.ratings[ratingIndex].rating = req.body.rating
        else {
            const newRating = {
                ratedBy: req.user.id,
                rating: req.body.rating
            }
            ratedDiscount.ratings.push(newRating)
        }

        await ratedDiscount.save()

        return res.status(200).send({message: 'Dodano ocenę.', ratings: ratedDiscount.ratings})
    }
    catch(error) {
        return next(error)
    }
})
//list discount ratings
router.get('/rate/:id', isValidId('id'), async (req, res, next) => {
    try {
        const discount = await Discount.findById(req.params.id, 'ratings')
        if(!discount) throw createError(404, 'Podana okazja nie istnieje.')

        return res.status(200).send(discount.ratings)
    } 
    catch(error) {
        return next(error)
    }
})

//delete discount (admin can delete every single)
router.delete('/manage/:id', isValidId('id'), isAuth, async (req, res, next) => {
    try {
        const possibleAdmin = req.checkedUser.isAdmin

        const deletedDiscount = await Discount.findById(req.params.id)
        if(!deletedDiscount) throw createError(404, 'Podana okazja nie istnieje.')

        if(deletedDiscount.addedBy==req.user.id || possibleAdmin) {
            //fs.rmdirSync(`${__dirname}/../../uploads/${deletedDiscount._id}`, {recursive: true})
            await del(`${__dirname}/../../uploads/${deletedDiscount._id}`)
            
            await deletedDiscount.remove()
    
            return res.status(200).send({message: 'Usunięto okazję.'})
        }
        else throw createError(403, 'Brak wystarczających uprawnień.')
    } 
    catch(error) {
        return next(error)
    }
})
//update discount (admin can update every single)
router.put('/manage/:id', isValidId('id'), isAuth, upload.array('files'), async (req, res, next) => {
    try {
        const possibleAdmin = req.checkedUser.isAdmin

        const validationResult = await updateValidation.validateAsync({
            title: req.body.title,
            price: req.body.price,
            prevprice: req.body.prevprice,
            store: req.body.store,
            freeShipping: req.body.freeShipping,
            description: req.body.description,
            discountCode: req.body.discountCode,
            link: req.body.link,
            category: req.body.category
        })

        const updatedDiscount = await Discount.findById(req.params.id)
        if(!updatedDiscount) throw createError(404, 'Podana okazja nie istnieje.')

        if(updatedDiscount.addedBy==req.user.id || possibleAdmin) {
            let images = [], imagesToKeep = [], imagesToUpload = []
            if(Array.isArray(req.body.images)) images = req.body.images
            else if(!Array.isArray(req.body.images) && req.body.images!==undefined) images.push(req.body.images)

            if(images.length>1) throw createError(422, 'Przesłano błędne dane.')
            else if(req.files.length>(1-images.length)) throw createError(406, 'Przesłano zbyt dużo plików.')
            else {
                for(let i=0; i<updatedDiscount.images.length; i++) {
                    if(images.includes(updatedDiscount.images[i])) imagesToKeep.push(updatedDiscount.images[i])
                    else fs.unlinkSync(`${__dirname}/../../uploads/${updatedDiscount._id}/${updatedDiscount.images[i]}`)
                }

                for(let i=0; i<req.files.length; i++) {
                    if(req.files[i].detectedFileExtension!=='.jpg' && 
                    req.files[i].detectedFileExtension!=='.jpeg' && 
                    req.files[i].detectedFileExtension!=='.png') throw createError(406, 'Format przesłanego pliku jest niepoprawny.')
                    if(req.files[i].size>(5*1024*1024)) throw createError(406, 'Rozmiar przesłanego pliku jest za duży.')

                    const filename = Date.now() + '_' + req.files[i].originalName
                    await pipeline(req.files[i].stream, fs.createWriteStream(`${__dirname}/../../uploads/${updatedDiscount._id}/${filename}`))
                    imagesToUpload.push(filename)
                }
            }
            
            updatedDiscount.title = validationResult.title
            updatedDiscount.price = validationResult.price
            updatedDiscount.prevprice = validationResult.prevprice
            updatedDiscount.store = validationResult.store
            updatedDiscount.freeShipping = validationResult.freeShipping
            updatedDiscount.description = validationResult.description
            updatedDiscount.discountCode = validationResult.discountCode
            updatedDiscount.link = validationResult.link
            updatedDiscount.category = validationResult.category
            updatedDiscount.images = imagesToKeep.concat(imagesToUpload)
            await updatedDiscount.save()
        }
        else throw createError(403, 'Brak wystarczających uprawnień.')

        return res.status(200).send({message: 'Zaktualizowano okazję.', discount: updatedDiscount})
    } 
    catch(error) {
        if(error.isJoi===true) {
            error.status = 422
            error.message = 'Przesłano błędne dane.'
        }
        return next(error)
    }
})
//create new discount
router.post('/manage', isAuth, upload.array('files'), async (req, res, next) => {
    try {
        const validationResult = await createValidation.validateAsync({
            title: req.body.title,
            price: req.body.price,
            prevprice: req.body.prevprice,
            store: req.body.store,
            freeShipping: req.body.freeShipping,
            description: req.body.description,
            discountCode: req.body.discountCode,
            link: req.body.link,
            category: req.body.category
        })
        
        const newDiscount = new Discount({
            addedBy: req.user.id,
            title: validationResult.title,
            price: validationResult.price,
            prevprice: validationResult.prevprice,
            store: validationResult.store,
            freeShipping: validationResult.freeShipping,
            description: validationResult.description,
            discountCode: validationResult.discountCode,
            link: validationResult.link,
            category: validationResult.category,
            images: []
        })

        fs.mkdirSync(`${__dirname}/../../uploads/${newDiscount._id}`, {recursive: false})
        if(req.files.length>1) throw createError(406, 'Przesłano zbyt dużo plików.')
        else {
            for(let i=0; i<req.files.length; i++) {
                if(req.files[i].detectedFileExtension!=='.jpg' && 
                   req.files[i].detectedFileExtension!=='.jpeg' && 
                   req.files[i].detectedFileExtension!=='.png') throw createError(406, 'Format przesłanego pliku jest niepoprawny.')
                if(req.files[i].size>(5*1024*1024)) throw createError(406, 'Rozmiar przesłanego pliku jest za duży.')

                const filename = Date.now() + '_' + req.files[i].originalName
                await pipeline(req.files[i].stream, fs.createWriteStream(`${__dirname}/../../uploads/${newDiscount._id}/${filename}`))
                newDiscount.images.push(filename)
            }
        }

        await newDiscount.save()

        return res.status(201).send({message: 'Dodano nową okazję.', discount: newDiscount})
    } 
    catch(error) {
        if(error.isJoi===true) {
            error.status = 422
            error.message = 'Przesłano błędne dane.'
        }
        return next(error)
    }
})

//list all discounts
router.get('/', isPageLimit(15), async (req, res, next) => {
    try {
        const page = req.query.page
        const limit = req.query.limit

        let sortOrder = {}
        if(req.query.sortOrder && req.query.sortOrder==='date_oldest') sortOrder = {_id: 1}
        else if(req.query.sortOrder && req.query.sortOrder==='price_highest') sortOrder = {price: -1}
        else if(req.query.sortOrder && req.query.sortOrder==='price_lowest') sortOrder = {price: 1}
        else sortOrder = {_id: -1}

        let category = {}
        if(req.query.category) category = await listValidation.validateAsync({category: req.query.category})
        
        let discounts = {}
        let count = 0
        if(req.query.category && req.query.searchKeyword) {
            count = await Discount.find({category: category.category, title: {$regex: req.query.searchKeyword, $options: 'i'}}).countDocuments()
            discounts = await Discount.find({category: category.category, title: {$regex: req.query.searchKeyword, $options: 'i'}}).sort(sortOrder).limit(limit * 1).skip((page - 1) * limit).populate('addedBy', 'nick')
        }
        else if(req.query.category) {
            count = await Discount.find({category: category.category}).countDocuments()
            discounts = await Discount.find({category: category.category}).sort(sortOrder).limit(limit * 1).skip((page - 1) * limit).populate('addedBy', 'nick')
        }
        else if(req.query.searchKeyword) {
            count = await Discount.find({title: {$regex: req.query.searchKeyword, $options: 'i'}}).countDocuments()
            discounts = await Discount.find({title: {$regex: req.query.searchKeyword, $options: 'i'}}).sort(sortOrder).limit(limit * 1).skip((page - 1) * limit).populate('addedBy', 'nick')
        }
        else {
            count = await Discount.find({}).countDocuments()
            discounts = await Discount.find({}).sort(sortOrder).limit(limit * 1).skip((page - 1) * limit).populate('addedBy', 'nick')
        }

        return res.status(200).send({count, discounts: discounts})
    } 
    catch(error) {
        if(error.isJoi===true) {
            error.status = 422
            error.message = 'Przesłano błędne dane.'
        }
        return next(error)
    }
})
//list discount details
router.get('/:id', isValidId('id'), async (req, res, next) => {
    try {
        const discount = await Discount.findById(req.params.id, '-ratings').populate('addedBy', 'nick')
        if(!discount) throw createError(404, 'Podana okazja nie istnieje.')

        return res.status(200).send(discount)
    } 
    catch(error) {
        return next(error)
    }
})

export default router
