import mongoose from 'mongoose'
import config from './environmentVariables'

const databaseConnect = app => {
    mongoose.connection.on('connected', () => console.log('MongoDB connection established'))
    mongoose.connection.on('disconnected', () => console.log('MongoDB connection dropped'))

    process.on('SIGINT', async () => {
        await mongoose.connection.close()
        process.exit(0)
    })

    mongoose.connect(config.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(() => app.emit('ready'))
    .catch(error => console.log(error.message))
}

export default databaseConnect
