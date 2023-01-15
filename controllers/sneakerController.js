const mongoose = require('mongoose')
const ReadFeatures = require('../utils/readFeatures')

const Sneaker = require('../models/sneaker')
const catchAsync = require('../utils/catchAsync')

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