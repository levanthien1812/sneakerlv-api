import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/appError.js'
import Cart from '../models/cart.js'

export const getAllCarts = catchAsync(async (req, res, next) => {
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

export const deleteCarts = catchAsync(async (req, res, next) => {
    const ids = req.query.ids.split(',')

    ids.forEach(async id => {
        await Cart.findByIdAndDelete(id)
    });

    return res.status(200).json({
        status: 'success'
    })
})

export const updateCart = catchAsync(async (req, res, next) => {
    const {quantity, size} = req.body
    const cartToUpdate = await Cart.findById(req.params.id)

    if (quantity) cartToUpdate.quantity = quantity
    if (size) cartToUpdate.size = size
    
    if (cartToUpdate.quantity === 0) {
        await Cart.findByIdAndDelete(cartToUpdate.id)
    } else {
        await cartToUpdate.save()
    }
    
    return res.status(200).json({
        status: 'success',
        data: cartToUpdate
    })
})