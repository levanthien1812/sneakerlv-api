const mongoose = require('mongoose')
const ReadFeatures = require('../utils/readFeatures')

const Sneaker = require('../models/sneaker')
const catchAsync = require('../utils/catchAsync')
const Cart = require('../models/cart')

exports.createSneaker = catchAsync(async (req, res, next) => {
    const sneakerReq = req.body
    const newSneaker = await Sneaker.create(sneakerReq)

    if (newSneaker) {
        res.status(200).json({
            status: 'success',
            data: newSneaker
        })
    }
})

exports.getSneakers = catchAsync(async (req, res, next) => {
    const sneakersQuery = Sneaker.find()
    let features = (new ReadFeatures(sneakersQuery, req.query)).filter().sort().paginate()

    const sneakers = await features.query

    return res.status(200).json({
        status: 'success',
        quantity: sneakers.length,
        data: sneakers
    })
})

exports.getSneaker = catchAsync(async (req, res, next) => {
    const sneaker = await Sneaker.find({slug: req.params.slug})

    return res.status(200).json({
        status: 'success',
        data: sneaker
    })
})

exports.updateSneaker = catchAsync(async (req, res, next) => {
    
})

exports.deleteSneaker = catchAsync(async (req, res, next) => {
    await Sneaker.deleteOne({slug: req.params.slug})

    return res.status(200).json({
        status: 'success',
    })
})

exports.createCart = catchAsync(async (req, res, next) => {
    const sneaker = await Sneaker.findOne({ slug: req.params.slug })
    const cartCheck = await Cart.findOne({
        sneaker: sneaker._id,
        user: req.user._id,
        size: req.body.size
    })
    let cart
    if (cartCheck) {
        cart = await Cart.findByIdAndUpdate(cartCheck._id, {
            quantity: cartCheck.quantity + req.body.quantity
        }, { new: true })
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