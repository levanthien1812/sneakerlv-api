import catchAsync from "../utils/catchAsync.js";
import UserModel from "../models/user.js"
import ShippingInfo from '../models/shippingInfo.js';
import AppError from "../utils/appError.js";

export const createShippingInfo = catchAsync(async (req, res, next) => {
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

export const getShippingInfo = catchAsync(async (req, res, next) => {
    const shippingInfos = await ShippingInfo.find({ user: req.user._id })
    
    return res.status(200).json({
        status: 'success',
        quantity: shippingInfos.length,
        data: shippingInfos
    })
})

export const deleteShippingInfo = catchAsync(async (req, res, next) => {
    await ShippingInfo.findByIdAndDelete(req.params.id)

    return res.status(200).json({
        status: 'success'
    })
})

export const updateShippingInfo = catchAsync(async (req, res, next) => {
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

export const getUser = catchAsync(async (req, res, next) => {
    const user = await UserModel.findById(req.user._id).select('name email phoneNum photo gender')

    return res.status(200).json({
        status: 'success',
        data: user
    })
})
