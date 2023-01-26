const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const Order = require('../models/order')
const Cart = require('../models/cart')
const ShippingInfo = require('../models/shippingInfo')

exports.createOrder = catchAsync(async (req, res, next) => {
    // Splits carts string of ids into arrays of ids
    const ids = req.query.carts.split(',')

    const newOrder = await Order.create({
        user: req.user._id,
        carts: ids,
        shippingInfo: req.query.shippingInfo,
        paymentMethod: req.query.paymentMethod
    })

    // Unactive cart(s) after creating order
    ids.forEach(async id => {
        await Cart.findByIdAndUpdate(id, {
            active: false
        })
    })

    return res.status(200).json({
        status: 'success',
        data: newOrder
    })
})

exports.getAllOrders = catchAsync(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id })
    
    return res.status(200).json({
        status: 'success',
        quantity: orders.length,
        data: orders
    })
})

exports.createShippingInfo = catchAsync(async (req, res, next) => {
    const {name, address, phoneNum} = req.body
    if (await ShippingInfo.exists({
            address: address,
            phoneNum: phoneNum
    }))
        return next(new AppError('Duplicated shipping address! Try again.'));
    
    const newShippingInfo = await ShippingInfo.create({
        user: req.user._id,
        name: name,
        address: address,
        phoneNum: phoneNum,
    })

    return res.status(200).json({
        status: 'success',
        data: newShippingInfo
    })
})

exports.deleteOrder = catchAsync(async (req, res, next) => {
    const order = await Order.findById(req.params.id)
    // Không được hủy đơn hàng sau khi giao cho đơn vị vận chuyển
    if (order.state.includes('giao cho đơn vị vận chuyển')) {
        return res.status(200).json({
            status: 'fail',
            message: 'Can not cancel order! Your parcel is being shipped to you.'
        })
    }

    await Order.findOneAndDelete(req.params.id)
    res.status(200).json({
        status: 'success'
    })
})