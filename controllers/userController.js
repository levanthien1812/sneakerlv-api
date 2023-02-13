const catchAsync = require("../utils/catchAsync");
const UserModel = require("../models/user")
const ShippingInfo = require('../models/shippingInfo');
const AppError = require("../utils/appError");

exports.createShippingInfo = catchAsync(async (req, res, next) => {
    const {name, address, phoneNum} = req.body
    if (await ShippingInfo.exists({
            address: address,
            phoneNum: phoneNum
        }))
        return next(new AppError('Duplicated shipping address! Try again.'));

    const newShippingInfo = await ShippingInfo.create({
        user: req.user._id,
        name,
        address,
        phoneNum
    })

    return res.status(200).json({
        status: 'success',
        data: newShippingInfo
    })
})

exports.getShippingInfo = catchAsync(async (req, res, next) => {
    const shippingInfos = await ShippingInfo.find({ user: req.user._id })
    
    return res.status(200).json({
        status: 'success',
        quantity: shippingInfos.length,
        data: shippingInfos
    })
})

exports.deleteShippingInfo = catchAsync(async (req, res, next) => {
    await ShippingInfo.findByIdAndDelete(req.params.id)

    return res.status(200).json({
        status: 'success'
    })
})

exports.updateShippingInfo = catchAsync(async (req, res, next) => {
    const {address, phoneNum} = req.body
    if (await ShippingInfo.exists({
            address: address,
            phoneNum: phoneNum
        }))
        return next(new AppError('Duplicated shipping address! Try again.'));
    
    const updatedShippingInfo = await ShippingInfo.findByIdAndUpdate(req.params.id, req.body, {new: true})

    return res.status(200).json({
        status: 'success',
        data: updatedShippingInfo
    })
})

exports.getUser = catchAsync(async (req, res, next) => {
    const user = await UserModel.findById(req.user._id).select('name email phoneNum photo gender')

    return res.status(200).json({
        status: 'success',
        data: user
    })
})
