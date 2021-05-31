import express from 'express'
import cors from 'cors'
//import rateLimit from 'express-rate-limit'
//import slowDown from 'express-slow-down'
import createError from 'http-errors'
import databaseConnect from './config/databaseConnect'
import config from './config/environmentVariables'
import userRoute from './routes/userRoute'
import discountRoute from './routes/discountRoute'

const app = express()
databaseConnect(app)

app.set('trust proxy', 'loopback, ' + config.IP)

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors())

//static files
app.use('/static/', express.static('uploads'))
//routes
app.use('/users', userRoute)
app.use('/discounts', discountRoute)
//404 error
app.use(async (req, res, next) => {
    next(createError(404, 'Podany zasób nie istnieje.'))
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.send({message: error.message})
})

app.on('ready', () => {
    app.listen(config.PORT, () => {
        console.log('Server started on port ' + config.PORT)
    })
})
