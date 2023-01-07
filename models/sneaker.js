const mongoose = require('mongoose')
const slugify = require('slugify')
const Schema = mongoose.Schema

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
    sizes: [{
        type: Number,
        min: 0,
        required: [true, 'Please provide the sizes of sneaker!']
    }],
    coverImage: {
        type: String,
        require: [true, 'Please provide the cover image of sneaker!']
    },
    images: [String],
    price: Number,
    promotionalPrice: {
        type: Number,
        max: this.price,
        min: 0,
        required: [true, 'Please provide the price of sneaker!']
    },
    brand: {
        type: Schema.Types.ObjectId,
        ref: 'Brand',
        required: true
    },
    description: String,
    favorites: {
        type: Number,
        default: 0,
        min: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    slug: String,
})

SneakerSchema.pre('save', function(next) {
    this.slug = slugify(this.name, {lower: true})
    next()
})

module.exports = mongoose.model('Sneaker', SneakerSchema)