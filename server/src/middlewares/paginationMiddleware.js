import createError from 'http-errors'

const isPageLimit = (limiter) => {
    return (req, res, next) => {
        const page = req.query.page ? parseInt(req.query.page) : 1
        const limit = req.query.limit ? parseInt(req.query.limit) : limiter

        if(isNaN(page) || !Number.isInteger(page) || page<1) return next(createError(422, 'Przesłano błędne dane.'))
        if(isNaN(limit) || !Number.isInteger(limit) || limit<1) return next(createError(422, 'Przesłano błędne dane.'))

        return next()
    }
}

export {isPageLimit}
