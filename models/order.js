const mongoose = require('mongoose')
const Sneaker = require('./sneaker')
const Cart = require('./cart')
const User = require('./user')

const OrderSchema = new mongoose.Schema({
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
    state: {
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
    this.populate('carts')

    let sneakersPrice = 0
    this.carts.forEach(async item => {
        const sneaker = await Sneaker.findById(item.sneaker)
        sneakersPrice += sneaker.promotionalPrice
    });
    
    this.totalPrice = this.shipPrice + sneakersPrice

    next()
})

module.exports = mongoose.model('Order', OrderSchema)