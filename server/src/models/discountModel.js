import mongoose from 'mongoose'

const ratingSchema = new mongoose.Schema({
    ratedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    rating: {type: Boolean, required: true}
})

const commentSchema = new mongoose.Schema({
    commentedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    message: {type: String, required: true},
    deleted: {type: Boolean, default: false},
    createdAt: {type: Date, required: true}
})

const discountSchema = new mongoose.Schema({
    addedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    title: {type: String, required: true},
    price: {type: Number, required: true},
    prevprice: {type: Number},
    store: {type: String},
    freeShipping: {type: Boolean},
    description: {type: String},
    discountCode: {type: String},
    link: {type: String, required: true},
    category: {type: String},
    images: {type: Array},
    ratings: [ratingSchema],
    comments: [commentSchema]
}, {
    timestamps: true
})

const discountModel = mongoose.model('Discount', discountSchema)

export default discountModel
