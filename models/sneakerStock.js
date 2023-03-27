const mongoose = require('mongoose')

const SneakerStock = mongoose.Schema({
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
    // quantity of sneaker in stock
    quantity: {
        type: Number,
        min: 0,
        required: [true, 'Please provide the number of sneakers in stock']
    }
})