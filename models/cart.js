import mongoose from "mongoose"
import Sneaker from './sneaker.js'
import sneakerCategory from "./sneakerCategory.js"

const CartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    sneaker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sneaker'
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SneakerCategory'
    },
    quantity: {
        type: Number,
        default: 1,
        min: 1
    },
    price: Number,
    isChosen: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: true
    }
})

CartSchema.pre('save',async function (next) {
    const category = await sneakerCategory.findById(this.category._id)
    this.price = category.price * this.quantity
    next()
})

CartSchema.pre(/^find/,async function (next) {
    this.populate('sneaker', '_id id slug name coverImage brand rating')
    this.populate('category')
    next()
})

export default mongoose.model('Cart', CartSchema)