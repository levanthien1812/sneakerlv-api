import mongoose from "mongoose"
const Schema = mongoose.Schema

const ReviewSchema = new Schema({
    id: {
        type: mongoose.Types.ObjectId,
        unique: [true, 'Each review must have unique id'],
        require: true
    },
    content: {
        type: String,
        require: [true, 'Please provide content of review']
    },
    images: [{
        type: String
    }],
    rating: {
        type: Number,
        default: 5,
        min: 0,
        max: 5,
    },
    sneaker: {
        type: mongoose.Types.ObjectId,
        ref: 'Sneaker',
        require: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        require: true
    }
})

export default mongoose.model('Review', ReviewSchema)