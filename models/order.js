import mongoose from "mongoose"
import Cart from "./cart.js"

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    },
    cartItems: [{
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'Cart'
    }],
    shippingFee: {
        type: Number,
        default: 0
    },
    totalPrice: {
        type: Number,
        default: 0
    },
    shippingInfo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ShippingInfo'
    },
    status: {
        type: String,
        default: "pending",
        enum: {
            values: ['pending', 'shipping', 'received', 'cancelled']
        }
    },
    paymentMethod: {
        type: String,
        require: [true, 'Please choose your payment method!'],
        enum: {
            values: ['transfer', 'cash']
        }
    }
})

// OrderSchema.pre('save', async function (next) {
//     // Calculate total price
//     let cartsPrice = 0
//     await Promise.all(this.cartItems.map(async item => {
//         const cart = await Cart.findById(item)
//         cartsPrice += cart.price
//     }))
    
//     this.totalPrice = this.shipPrice + cartsPrice
//     next()
// })

export default mongoose.model('Order', OrderSchema)