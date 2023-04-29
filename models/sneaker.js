import mongoose from "mongoose"
import slugify from "slugify"
const Schema = mongoose.Schema
import SneakerCategory from "./sneakerCategory.js"

const SneakerSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: [true, 'This ID is already taken! Try another ID']
    },
    name: {
        type: String,
        required: [true, 'Please provide the name of sneaker!']
    },
    coverImage: {
        type: String,
        require: [true, 'Please provide the cover image of sneaker!']
    },
    images: [String],
    brand: {
        type: Schema.Types.ObjectId,
        ref: 'Brand',
        required: true
    },
    description: String,
    defaultCategory: {
        type: Schema.Types.ObjectId,
        ref: 'SneakerCategory'
    },
    favorites: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    rating: {
        type: Number,
        default: 5,
        min: 0,
        max: 5,
    },
    ratingQuantity: {
        type: Number,
        default: 0,
    },
    totalSold: {
        type: Number,
        default: 0
    },
    price: {
        type: Object,
        default: {
            min: 0,
            max: 0
        }
    },
    slug: String,
})

SneakerSchema.pre('save', function (next) {
    this.slug = slugify(this.name, {
        lower: true
    })
    next()
})

SneakerSchema.pre(/^find/, function (next) {
    this.populate('brand')
    // Calculate total quantity sold
    // According to Order data
    next()
})

export default mongoose.model('Sneaker', SneakerSchema)