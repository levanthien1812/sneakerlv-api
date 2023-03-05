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
    const cartToUpdate = await Cart.findById(req.params.id)

    if (quantity) cartToUpdate.quantity = quantity
    if (size) cartToUpdate.size = size
    
    await cartToUpdate.save()

    return res.status(200).json({
        status: 'success',
        data: cartToUpdate
    })
})