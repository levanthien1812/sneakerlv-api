import mongoose from "mongoose"
import Cart from "./cart.js"

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    },
    carts: [{
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'Cart'
    }],
    shipPrice: {
        type: Number,
        default: 0
    },
    totalPrice: {
        type: Number
    },
    shippingInfo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ShippingInfo'
    },
    status: {
        type: String,
        enum: {
            values: ['Đơn hàng đã được đặt', 'Người gửi đang chuẩn bị hàng', 'Đang vận chuẩn', 'Giao hàng không thành công', 'Đã giao']
        }
    },
    paymentMethod: {
        type: String,
        require: [true, 'Please choose your payment method!'],
        enum: {
            values: ['Chuyển khoản', 'Thanh toán khi nhận hàng']
        }
    }
})

OrderSchema.pre('save', async function (next) {
    // Calculate total price
    let cartsPrice = 0
    await Promise.all(this.carts.map(async item => {
        const cart = await Cart.findById(item)
        cartsPrice += cart.price
    }))
    
    this.totalPrice = this.shipPrice + cartsPrice
    next()
})

export default mongoose.model('Order', OrderSchema)