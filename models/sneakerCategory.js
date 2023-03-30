import mongoose from "mongoose"

const SneakerCategorySchemna = mongoose.Schema({
    sneaker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sneaker'
    },
    size: {
        type: Number,
        require: [true, 'You must provide the size of this category']
    },
    color: {
        type: String,
    },
    price: {
        type: Number,
        require: [true, 'You must provide the price of this category']
    },
    // Image must be provided when color is included
    image: {
        type: String,
    },
    // quantity of sneaker in stock
    quantity: {
        type: Number,
        min: 0,
        required: [true, 'Please provide the number of sneakers in stock']
    },
    isDefault: {
        type: Boolean,
        default: false,
    }
})

export default mongoose.model('SneakerCategory', SneakerCategorySchemna)