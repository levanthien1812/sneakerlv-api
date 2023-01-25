const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const Order = require('../models/order')
const ShippingInfo = require('../models/shippingInfo')

exports.createOrder = catchAsync(async (req, res, next) => {
    const ids = req.query.carts.split(',')

    const newOrder = await Order.create({
        carts: ids,
        shippingInfo: req.query.shippingInfo,
        paymentMethod: req.query.paymentMethod
    })

    return res.status(200).json({
        status: 'success',
        data: newOrder
    })
})

exports.createShippingInfo = catchAsync(async (req, res, next) => {
    const {name, address, phoneNum} = req.body
    if (await ShippingInfo.exists({
            address: address,
            phoneNum: phoneNum
    }))
        return next(new AppError('Duplicated shipping address! Try again.'));
    
    const newShippingInfo = await ShippingInfo.create({
        user: req.user._id,
        name: name,
        address: address,
        phoneNum: phoneNum,
    })

    return res.status(200).json({
        status: 'success',
        data: newShippingInfo
    })
})