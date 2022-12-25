const mongoose = require('mongoose')
const ReadFeatures = require('../utils/readFeatures')

const Sneaker = require('../models/sneaker')
const catchAsync = require('../utils/catchAsync')

exports.createSneaker = catchAsync(async (req, res, next) => {
    const sneakerReq = req.body
    const newSneaker = await Sneaker.create(sneakerReq)

    if (newSneaker) {
        res.status(200).json({
            'status': 'success',
            'data': newSneaker
        })
    }
})

exports.getSneakers = catchAsync(async (req, res, next) => {
    const sneakersQuery = Sneaker.find()
    let features = (new ReadFeatures(sneakersQuery, req.query)).filter().sort().paginate()
    
    const sneakers = await features.query

    return res.status(200).json({
        'quantity': sneakers.length,
        'data': sneakers
    })
})