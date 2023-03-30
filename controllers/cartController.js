import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/appError.js'
import Cart from '../models/cart.js'
import Sneaker from '../models/sneaker.js'

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

export const createCart = catchAsync(async (req, res, next) => {
    const sneaker = await Sneaker.findOne({
        slug: req.params.slug
    })
    const cartCheck = await Cart.findOne({
        sneaker: sneaker._id,
        user: req.user._id,
        size: req.body.size
    })
    let cart
    if (cartCheck) {
        cart = await Cart.findByIdAndUpdate(cartCheck._id, {
            quantity: cartCheck.quantity + req.body.quantity
        }, {
            new: true
        })
    } else {
        cart = await Cart.create({
            sneaker: sneaker._id,
            user: req.user._id,
            size: req.body.size,
            quantity: req.body.quantity
        })
    }

    if (cart) {
        return res.status(200).json({
            status: 'success',
            data: cart,
        })
    }
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