const catchAsync = require("../utils/catchAsync")
const UserModel = require("../models/user")
const AppError = require('../utils/appError')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

const createSendToken = (user, res) => {
    const token = signToken(user._id)

    res.cookie('jwt', token, {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 3600 * 1000),
        httpOnly: true
    })

    user.password = undefined

    res.status(200).json({
        status: 'success',
        token,
        data: {
            user
        }
    })
}

exports.signUp = catchAsync(async (req, res, next) => {
    const newUser = await UserModel.create(req.body)
    createSendToken(newUser, res)
})

exports.logIn = catchAsync(async (req, res, next) => {
    const { email, password } = req.body
    
    if (!email || !password) {
        return next(new AppError('Please provide your email and password!', 404))
    }

    const user = await UserModel.findOne({ email }).select('+password')
    if (!user) 
        return next(new AppError('There\'s no user with your email!', 404))
    if (!bcrypt.compare(password, user.password))
        return next(new AppError('Your password is incorrect! Try again.', 404))
    
    createSendToken(user, res)
})