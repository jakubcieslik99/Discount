import jwt from 'jsonwebtoken'
import createError from 'http-errors'
import config from '../config/environmentVariables'
import User from '../models/userModel'

const getToken = user => {
    return new Promise((resolve, reject) => {
        jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin
        }, config.JWT_SECRET, {
            expiresIn: '14d'
        }, (error, token) => {
            if(error) {
                console.log(error.message)
                return reject(createError(500, 'Błąd serwera.'))
            }
            return resolve(token)
        }) 
    })
}

const isAuth = (req, res, next) => {
    if(!req.headers.authorization) return next(createError(401, 'Błąd autoryzacji.'))
    const bearerToken = req.headers.authorization
    const token = bearerToken.slice(7, bearerToken.length)
    
    jwt.verify(token, config.JWT_SECRET, async (error, decode) => {
        if(error) return next(createError(401, 'Błąd autoryzacji.'))
        req.user = decode

        const checkedUser = await User.findById(req.user.id)
        if(!checkedUser) return next(createError(404, 'Konto użytkownika nie istnieje lub zostało usunięte.'))
        req.checkedUser = checkedUser

        return next()
    })
}

const isAdmin = (req, res, next) => {
    if(!req.user) return next(createError(401, 'Błąd autoryzacji.'))
    if(!req.checkedUser) return next(createError(404, 'Konto użytkownika nie istnieje lub zostało usunięte.'))
    if(!req.checkedUser.isAdmin) return next(createError(403, 'Brak wystarczających uprawnień.'))

    return next()
}

export {getToken, isAuth, isAdmin}
