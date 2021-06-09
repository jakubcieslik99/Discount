import express from 'express'
import createError from 'http-errors'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import fs from 'fs'
import config from '../config/environmentVariables'
import User from '../models/userModel'
import Discount from '../models/discountModel'
import {isValidId} from '../middlewares/paramsMiddleware'
import {getToken, isAuth, isAdmin} from '../middlewares/authMiddleware'
import {isPageLimit} from '../middlewares/paginationMiddleware'
import {updateValidation, loginValidation, registerValidation, userConfirmEmailValidation, userConfirmValidation, passwordResetEmailValidation, passwordResetValidation} from '../validations/userValidation'

const router = express.Router()

const sendMail = async (message) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'contactdiscountapp@gmail.com',
            pass: config.GMAIL_PASS
        }
    })

    await transporter.sendMail(message)
}

//delete user
router.delete('/delete', isAuth, async (req, res, next) => {
    try {
        const deletedUserRatedDiscounts = await Discount.find({'ratings.ratedBy': req.user.id}, '_id')
        if(deletedUserRatedDiscounts.length>0) {
            for(let i=0; i<deletedUserRatedDiscounts.length; i++) {
                const unratedDiscount = await Discount.findById(deletedUserRatedDiscounts[i]._id)
                const unratingIndex = unratedDiscount.ratings.findIndex(rating => rating.ratedBy==req.user.id)
                if(unratingIndex>=0) {
                    let newRatings = unratedDiscount.ratings
                    newRatings.splice(unratingIndex, 1)
                    unratedDiscount.ratings = newRatings
            
                    await unratedDiscount.save()
                }
            }
        }

        const deletedUserDiscounts = await Discount.find({addedBy: req.user.id}, '_id')
        if(deletedUserDiscounts.length>0) {
            for(let i=0; i<deletedUserDiscounts.length; i++) {
                fs.rmdirSync(`${__dirname}/../../uploads/${deletedUserDiscounts[i]._id}`, {recursive: true})

                await Discount.findByIdAndRemove(deletedUserDiscounts[i]._id)
            }
        }

        await req.checkedUser.remove()

        return res.status(200).send({message: 'Usunięto konto z serwisu.'})
    }
    catch(error) {
        return next(error)
    }
})
//update user
router.put('/update', isAuth, async (req, res, next) => {
    try {
        if(req.user.id!==req.body.id) throw createError(422, 'Przesłano błędne dane.')

        const validationResult = await updateValidation.validateAsync({
            email: req.body.email,
            nick: req.body.nick,
            password: req.body.password,
            newpassword: req.body.newpassword
        })

        const conflictUserEmail = await User.findOne({email: validationResult.email})
        if(conflictUserEmail && conflictUserEmail._id!=req.body.id) throw createError(409, 'Istnieje już użytkownik o podanym adresie e-mail.')
        const conflictUserNick = await User.findOne({nick: validationResult.nick})
        if(conflictUserNick && conflictUserNick._id!=req.body.id) throw createError(409, 'Istnieje już użytkownik o podanym nicku.')

        const updateUser = await User.findById(req.body.id)
        if(!updateUser) throw createError(404, 'Podany użytkownik nie istnieje.')

        const checkPassword = await bcrypt.compare(validationResult.password, updateUser.password)
        if(!checkPassword) throw createError(401, 'Błędne hasło.')

        updateUser.email = validationResult.email
        updateUser.nick = validationResult.nick
        if(validationResult.newpassword!=='') {
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(validationResult.newpassword, salt)
            updateUser.password = hashedPassword
        }
        const updatedUser = await updateUser.save()

        const generateToken = await getToken(updatedUser)

        return res.status(200).send({
            message: 'Zaktualizowano profil.', 
            data: {
                id: updatedUser._id,
                email: updatedUser.email,
                nick: updatedUser.nick,
                isAdmin: updatedUser.isAdmin,
                token: generateToken
            }
        })
    } 
    catch(error) {
        if(error.isJoi===true) {
            error.status = 422
            error.message = 'Przesłano błędne dane.'
        }
        return next(error)
    }
})
//fetch user
router.post('/fetch', isAuth, async (req, res, next) => {
    try {
        res.status(200).send()
    } 
    catch(error) {
        return next(error)
    }
})
//signin user
router.post('/signin', async (req, res, next) => {
    try {
        const validationResult = await loginValidation.validateAsync(req.body)
        
        const signinUser = await User.findOne({email: validationResult.email})
        if(!signinUser) throw createError(404, 'Konto użytkownika nie istnieje lub zostało usunięte.')
        
        if(!signinUser.confirmed) throw createError(401, 'E-mail nie został potwierdzony.')

        const checkPassword = await bcrypt.compare(validationResult.password, signinUser.password)
        if(!checkPassword) throw createError(401, 'Błędny e-mail lub hasło.')

        const generateToken = await getToken(signinUser)

        res.status(200).send({
            id: signinUser._id,
            nick: signinUser.nick,
            email: signinUser.email,
            isAdmin: signinUser.isAdmin,
            token: generateToken
        })
    } 
    catch(error) {
        if(error.isJoi===true) {
            error.status = 422
            error.message = 'Przesłano błędne dane.'
        }
        return next(error)
    }
})
//register user
router.post('/register', async (req, res, next) => {
    try {
        const validationResult = await registerValidation.validateAsync(req.body)

        const conflictUserEmail = await User.findOne({email: validationResult.email})
        if(conflictUserEmail) throw createError(409, 'Istnieje już użytkownik o podanym adresie e-mail.')
        const conflictUserNick = await User.findOne({nick: validationResult.nick})
        if(conflictUserNick) throw createError(409, 'Istnieje już użytkownik o podanym nicku.')

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(validationResult.password, salt)

        const createUser = new User({
            nick: validationResult.nick,
            email: validationResult.email,
            password: hashedPassword,
            token: crypto.randomBytes(64).toString('hex')
        })
        const createdUser = await createUser.save()

        const userConfirmationMessage = {
            from: 'Discount <contactdiscountapp@gmail.com>',
            to: validationResult.email,
            subject: `Discount - Potwierdź adres e-mail`,
            text: `
                Witaj ${createdUser.nick}! 
                Dziękujemy za rejestrację w Discount. 
                Proszę skopiuj i wklej w przeglądarce poniższy link w celu potwierdzenia swojego konta w serwisie.
                ${config.APP_URL}/confirm?token=${createdUser.token}
            `,
            html: `
                <h1>Witaj ${createdUser.nick}!</h1>
                <h4>Dziękujemy za rejestrację w Discount.</h4>
                <p>Proszę kliknij poniższy link w celu potwierdzenia swojego konta w serwisie.</p>
                <a href="${config.APP_URL}/signin?token=${createdUser.token}">Potwierdź</a>
            `
        }
        sendMail(userConfirmationMessage)

        res.status(201).send({message: 'Zarejestrowano pomyślnie. Teraz potwierdź e-mail aby się zalogować.'})
    } 
    catch(error) {
        if(error.isJoi===true) {
            error.status = 422
            error.message = 'Przesłano błędne dane.'
        }
        return next(error)
    }
})

//resend user confirmation link
router.post('/confirm/link', async (req, res, next) => {
    try {
        const validationResult = await userConfirmEmailValidation.validateAsync(req.body)

        const userConfirmationUser = await User.findOne({email: validationResult.email})
        if(!userConfirmationUser) throw createError(404, 'Konto użytkownika nie istnieje.')

        const checkPassword = await bcrypt.compare(validationResult.password, userConfirmationUser.password)
        if(!checkPassword) throw createError(401, 'Błędny e-mail lub hasło.')

        if(userConfirmationUser.confirmed) throw createError(409, 'E-mail został już potwierdzony.')

        userConfirmationUser.token = crypto.randomBytes(64).toString('hex')
        await userConfirmationUser.save()

        const userConfirmationMessage = {
            from: 'Discount <contactdiscountapp@gmail.com>',
            to: validationResult.email,
            subject: `Discount - Potwierdź adres e-mail`,
            text: `
                Witaj ${userConfirmationUser.nick}! 
                Dziękujemy za rejestrację w Discount. 
                Proszę skopiuj i wklej w przeglądarce poniższy link w celu potwierdzenia swojego konta w serwisie.
                ${config.APP_URL}/confirm?token=${userConfirmationUser.token}
            `,
            html: `
                <h1>Witaj ${userConfirmationUser.nick}!</h1>
                <h4>Dziękujemy za rejestrację w Discount.</h4>
                <p>Proszę kliknij poniższy link w celu potwierdzenia swojego konta w serwisie.</p>
                <a href="${config.APP_URL}/signin?token=${userConfirmationUser.token}">Potwierdź</a>
            `
        }
        sendMail(userConfirmationMessage)

        return res.status(200).send({message: 'Wysłano potwierdzenie ponownie. Teraz potwierdź e-mail aby się zalogować.'})
    } 
    catch(error) {
        if(error.isJoi===true) {
            error.status = 422
            error.message = 'Przesłano błędne dane.'
        }
        return next(error)
    }
})
//confirm user
router.post('/confirm', async (req, res, next) => {
    try {
        const validationResult = await userConfirmValidation.validateAsync(req.body)

        const userConfirmationUser = await User.findOne({token: validationResult.token})
        if(!userConfirmationUser) throw createError(406, 'Błąd weryfikacji. Konto mogło zostać już potwierdzone.')

        userConfirmationUser.token = null
        userConfirmationUser.confirmed = true
        await userConfirmationUser.save()

        return res.status(200).send({message: 'Potwierdzono konto pomyślnie. Teraz możesz się zalogować.'})
    } 
    catch(error) {
        return next(error)
    }
})

//send password reset link
router.post('/reset/link', async (req, res, next) => {
    try {
        const validationResult = await passwordResetEmailValidation.validateAsync(req.body)

        const passwordResetUser = await User.findOne({email: validationResult.email})
        if(!passwordResetUser) throw createError(404, 'Konto użytkownika nie istnieje.')

        passwordResetUser.token = crypto.randomBytes(64).toString('hex')
        await passwordResetUser.save()

        const passwordResetMessage = {
            from: 'Discount <contactdiscountapp@gmail.com>',
            to: validationResult.email,
            subject: `Discount - Zresetuj hasło`,
            text: `
                Witaj ${passwordResetUser.nick}!
                Na Twoim koncie została wygenerowana prośba o zresetowanie hasła. Jeśli to nie Ty ją wygenerowałeś, zignoruj tą wiadomość.
                Proszę skopiuj i wklej w przeglądarce poniższy link w celu zresetowania swojego hasła w serwisie.
                ${config.APP_URL}/reset?token=${passwordResetUser.token}
            `,
            html: `
                <h1>Witaj ${passwordResetUser.nick}!</h1>
                <h4>Na Twoim koncie została wygenerowana prośba o zresetowanie hasła. Jeśli to nie Ty ją wygenerowałeś, zignoruj tą wiadomość. </h4>
                <p>Proszę kliknij poniższy link w celu zresetowania swojego hasła w serwisie.</p>
                <a href="${config.APP_URL}/reset?token=${passwordResetUser.token}">Ustaw nowe hasło</a>
            `
        }
        sendMail(passwordResetMessage)

        return res.status(200).send({message: 'Wysłano wiadomość z linkiem do resetowania hasła.'})
    } 
    catch(error) {
        if(error.isJoi===true) {
            error.status = 422
            error.message = 'Przesłano błędne dane.'
        }
        return next(error)
    }
})
//confirm password recovery
router.post('/reset', async (req, res, next) => {
    try {
        const validationResult = await passwordResetValidation.validateAsync(req.body)

        const passwordResetUser = await User.findOne({token: validationResult.token})
        if(!passwordResetUser) throw createError(406, 'Błąd resetowania hasła.')

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(validationResult.password, salt)

        passwordResetUser.token = null
        passwordResetUser.password = hashedPassword
        await passwordResetUser.save()

        return res.status(200).send({message: 'Zmieniono hasło pomyślnie. Teraz możesz się zalogować.'})
    } 
    catch(error) {
        if(error.isJoi===true) {
            error.status = 422
            error.message = 'Przesłano błędne dane.'
        }
        return next(error)
    }
})

//change user rank (only admin can change for every single)
router.post('/rank/:id', isValidId('id'), isAuth, isAdmin, async (req, res, next) => {
    try {
        if(req.params.id===req.user.id) throw createError(406, 'Nie można zmienić uprawnień do aktualnie zalogowanego konta.')

        const changedUser = await User.findById(req.params.id)
        if(!changedUser) throw createError(404, 'Podany użytkownik nie istnieje.')

        const message = changedUser.isAdmin ? 'Usunięto uprawnienia administratora.' : 'Nadano uprawnienia administratora.'
        changedUser.isAdmin = !changedUser.isAdmin

        await changedUser.save()

        return res.status(200).send({message: message})
    }
    catch(error) {
        return next(error)
    }
})

//delete user (only admin can delete every single)
router.delete('/manage/:id', isValidId('id'), isAuth, isAdmin, async (req, res, next) => {
    try {
        if(req.params.id===req.user.id) throw createError(406, 'Nie można usunąć aktualnie zalogowanego konta z panelu administratora.')

        const deletedUser = await User.findById(req.params.id)
        if(!deletedUser) throw createError(404, 'Podany użytkownik nie istnieje.')

        const deletedUserRatedDiscounts = await Discount.find({'ratings.ratedBy': req.params.id}, '_id')
        if(deletedUserRatedDiscounts.length>0) {
            for(let i=0; i<deletedUserRatedDiscounts.length; i++) {
                const unratedDiscount = await Discount.findById(deletedUserRatedDiscounts[i]._id)
                const unratingIndex = unratedDiscount.ratings.findIndex(rating => rating.ratedBy==req.params.id)
                if(unratingIndex>=0) {
                    let newRatings = unratedDiscount.ratings
                    newRatings.splice(unratingIndex, 1)
                    unratedDiscount.ratings = newRatings
            
                    await unratedDiscount.save()
                }
            }
        }

        const deletedUserDiscounts = await Discount.find({addedBy: req.params.id}, '_id')
        if(deletedUserDiscounts.length>0) {
            for(let i=0; i<deletedUserDiscounts.length; i++) {

                fs.rmdirSync(`${__dirname}/../../uploads/${deletedUserDiscounts[i]._id}`, {recursive: true})

                await Discount.findByIdAndRemove(deletedUserDiscounts[i]._id)
            }
        }

        await deletedUser.remove()

        return res.status(200).send({message: 'Usunięto użytkownika.'})
    } 
    catch(error) {
        return next(error)
    }
})
//list all users (only admin can see every single)
router.get('/manage', isAuth, isAdmin, isPageLimit(15), async (req, res, next) => {
    try {
        const page = req.query.page
        const limit = req.query.limit

        let sortOrder = {}
        if(req.query.sortOrder && req.query.sortOrder==='nick_z') sortOrder = {nick: -1}
        else if(req.query.sortOrder && req.query.sortOrder==='date_newest') sortOrder = {createdAt: -1}
        else if(req.query.sortOrder && req.query.sortOrder==='date_oldest') sortOrder = {createdAt: 1}
        else sortOrder = {nick: 1}
        
        let users = {}
        let count = 0
        if(req.query.searchKeyword) {
            count = await User.find({nick: {$regex: req.query.searchKeyword, $options: 'i'}}).countDocuments()
            users = await User.find({nick: {$regex: req.query.searchKeyword, $options: 'i'}}, 'nick email isAdmin createdAt').sort(sortOrder).limit(limit * 1).skip((page - 1) * limit)
        }
        else {
            count = await User.find({}).countDocuments()
            users = await User.find({}, 'nick email isAdmin createdAt').sort(sortOrder).limit(limit * 1).skip((page - 1) * limit)
        }

        return res.status(200).send({count, users: users})
    } 
    catch(error) {
        if(error.isJoi===true) {
            error.status = 422
            error.message = 'Przesłano błędne dane.'
        }
        return next(error)
    }
})
//list user data
router.get('/:id', isValidId('id'), async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
        if(!user) throw createError(404, 'Podany użytkownik nie istnieje.')
    
        const discounts = await Discount.find({addedBy: req.params.id})
        
        return res.status(200).send({
            nick: user.nick,
            isAdmin: user.isAdmin,
            discounts: discounts
        })
    }
    catch(error) {
        return next(error)
    }
})

export default router
