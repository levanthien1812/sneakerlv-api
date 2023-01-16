const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const Cart = require('../models/user')

exports.getAllCarts = catchAsync(async (req, res, next) => {
    const cart = await Cart.find({user: req.user._id})

    return res.status(200).json({
        status: 'success',
        quantity: cart.length,
        data: cart
    })
})