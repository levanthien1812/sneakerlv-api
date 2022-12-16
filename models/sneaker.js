const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Sneaker = new Schema({
    id: {
        type: Schema.Types.ObjectId,
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
    inStock: {
        type: Number,
        min: 0,
        required: [true, 'Please provide the number of sneakers in stock']
    },
    favorites: {
        type: Number,
        default: 0,
        min: 0
    }
})