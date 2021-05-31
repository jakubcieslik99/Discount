import mongoose from 'mongoose'
import createError from 'http-errors'

const isValidId = (x, y=null, z=null) => {
    return (req, res, next) => {
        if(x!==null) if(!mongoose.isValidObjectId(eval('req.params.' + x))) throw createError(422, 'Przesłano błędne dane.')
        if(y!==null) if(!mongoose.isValidObjectId(eval('req.params.' + y))) throw createError(422, 'Przesłano błędne dane.')
        if(z!==null) if(!mongoose.isValidObjectId(eval('req.params.' + z))) throw createError(422, 'Przesłano błędne dane.')

        return next()
    }
}

export {isValidId}
