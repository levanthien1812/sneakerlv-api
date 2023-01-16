const mongoose = require('mongoose')
const Sneaker = require('./sneaker')
const Cart = require('./cart')
const User = require('./user')

const OrderSchema = new mongoose.Schema({
    cart: [{
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
    address: {
        type: String,
        require: true,
    },
    state: {
        type: String,
        enum: {
            values: ['Đơn hàng đã được đặt', 'Người gửi đang chuẩn bị hàng', 'Đang vận chuẩn', 'Giao hàng không thành công', 'Đã giao']
        }
    }
})

OrderSchema.pre('save', async function (next) {
    // Calculate total price
    this.populated('cart')

    let sneakersPrice = 0
    this.cart.forEach(async item =>  {
        const sneaker = await Sneaker.findById(this.cart.sneaker)
        sneakersPrice += sneaker.promotionalPrice
    });
    
    this.totalPrice = this.shipPrice + sneakersPrice

    // Get address of user
    const user = await User.findById(this.cart.user)
    this.address = user.address
    next()
})

module.exports = mongoose.model('Order', OrderSchema)