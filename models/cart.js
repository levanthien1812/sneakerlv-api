import mongoose from "mongoose"
import Sneaker from './sneaker.js'

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
    },
    price: Number,
    active: {
        type: Boolean,
        default: true
    }
})

CartSchema.pre('save',async function (next) {
    const sneaker = await Sneaker.findById(this.sneaker)
    this.price = sneaker.promotionalPrice * this.quantity
    next()
})

// CartSchema.pre(/^find/, function (next) {
//     this.populate('sneaker')
//     next()
// })

export default mongoose.model('Cart', CartSchema)