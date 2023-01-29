const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const Cart = require('../models/cart')

exports.getAllCarts = catchAsync(async (req, res, next) => {
    const carts = await Cart.find({
        user: req.user._id,
        active: true
    })

    return res.status(200).json({
        status: 'success',
        quantity: carts.length,
        data: carts
    })
})

exports.deleteCarts = catchAsync(async (req, res, next) => {
    const ids = req.query.ids.split(',')

    ids.forEach(async id => {
        await Cart.findByIdAndDelete(id)
    });

    return res.status(200).json({
        status: 'success'
    })
})

exports.updateCart = catchAsync(async (req, res, next) => {
    const {quantity, size} = req.body
    const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {
        quantity, size
    }, { new: true })

    return res.status(200).json({
        status: 'success',
        data: updatedCart
    })
})