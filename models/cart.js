const mongoose = require('mongoose')

const CartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    sneaker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sneaker'
    },
    size: {
        type: Number,
        require: [true, "Please select the size of sneaker!"]
    },
    quantity: {
        type: Number,
        default: 1,
        min: 1
    }
})

module.exports = mongoose.model('Cart', CartSchema)