import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    email: {type: String, required: true, lowercase: true, unique: true, dropDups: true},
    nick: {type: String, required: true, unique: true, dropDups: true},
    password: {type: String, required: true},
    token: {type: String},
    confirmed: {type: Boolean, default: false},
    isAdmin: {type: Boolean, default: false}
}, {
    timestamps: true
})

const userModel = mongoose.model('User', userSchema)

export default userModel
