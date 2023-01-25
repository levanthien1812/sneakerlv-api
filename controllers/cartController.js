const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const Cart = require('../models/cart')

exports.getAllCarts = catchAsync(async (req, res, next) => {
    const carts = await Cart.find({user: req.user._id})

    return res.status(200).json({
        status: 'success',
        quantity: carts.length,
        data: carts
    })
})

exports.deleteCarts = catchAsync(async (req, res, next) => {
    const ids = req.query.ids.split(',')

    ids.forEach(async ele => {
        await Cart.findByIdAndDelete(ele)
    });

    return res.status(200).json({
        status: 'success'
    })
})