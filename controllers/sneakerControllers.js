const mongoose = require('mongoose')

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