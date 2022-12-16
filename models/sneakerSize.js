const mongoose = require('mongoose')

const SneakerSize = mongoose.Schema({
    sneaker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sneaker'
    },
    size: {
        type: Number,
        enum: {
            values: this.sneaker.sizes
        }
    },
    inStock: {
        type: Number,
        min: 0,
        required: [true, 'Please provide the number of sneaker in stock']
    }
})