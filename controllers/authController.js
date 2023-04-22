import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import catchAsync from "../utils/catchAsync.js"
import UserModel from "../models/user.js"
import AppError from '../utils/appError.js'

const signToken = id => {
    return jwt.sign({
        id
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

const createSendToken = (user, res) => {
    const token = signToken(user._id)

    // res.cookie('jwt', token, {
    //     expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 3600 * 1000),
    //     domain: 'localhost',
    //     path: '/',
    //     secure: false,
    // })

    user.password = undefined

    res.status(200).json({
        status: 'success',
        token,
        data: {
            user
        },
    })
}

export const signUp = catchAsync(async (req, res, next) => {
    const newUser = await UserModel.create(req.body)
    createSendToken(newUser, res)
})

export const createGoogleUser = catchAsync(async (req, res, next) => {
    const {
        name,
        email,
        picture
    } = req.body
    const user = await UserModel.findOne({
        email
    })
    let newUser
    if (!user) {
        newUser = await UserModel.create({
            name,
            email,
            photo: picture,
            password: email,
            passwordConfirm: email,
            isGoogleAccount: true
        })

        createSendToken(newUser, res)
    } else {
        createSendToken(user, res)
    }
})

export const logIn = catchAsync(async (req, res, next) => {
    // destructuring syntax
    const {
        email,
        password
    } = req.body

    if (!email || !password) {
        return next(new AppError('Please provide your email and password!', 404))
    }

    const user = await UserModel.findOne({
        email
    }).select('+password')
    if (!user)
        return next(new AppError('There\'s no user with your email!', 404))
    if (!(await bcrypt.compare(password, user.password)))
        return next(new AppError('Your password is incorrect! Try again.', 404))

    createSendToken(user, res)
})

export const logOut = catchAsync(async (req, res, next) => {
    res.cookie('jwt', '', {
        expiresIn: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    })
    req.user = null
    res.locals.user = null

    return res.status(200).json({
        status: 'success'
    })
})

export const isLoggedIn = catchAsync(async (req, res, next) => {
    let token
    // Check if token exists
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt
    } else {
        return next(new AppError(token, 400))
    }

    // Check if token is valid
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Check if user still exists
    const freshUser = await UserModel.findById(decoded.id)
    if (!freshUser) {
        return next(new AppError('The user belong to this token no longer exists!', 401))
    }

    req.user = freshUser
    res.locals.user = freshUser
    next()
})

// Spread syntax 
export const restrictsTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You are not allow to perform this action', 403))
        }
        next()
    }
}

export const updatePassword = catchAsync(async (req, res, next) => {
    const {
        password,
        newPassword,
        newPasswordConfirm
    } = req.body
    if (!password || !newPassword || !newPasswordConfirm) {
        return next(new AppError('Please provide enough information!', 404))
    }

    if (!(await bcrypt.compare(password, req.user.password))) {
        return next(new AppError('Your current password is not correct! Try again.', 404))
    }

    if (newPassword !== newPasswordConfirm) {
        return next(new AppError('Your new password and password confirm is not the same! Try again.'), 404)
    }

    await UserModel.findByIdAndUpdate(req.user._id, {
        password: await bcrypt.hash(newPassword, 10)
    })

    res.status(200).json({
        status: 'success',
        message: 'You have updated your password successfully! Please login again!'
    })

    this.logOut(req, res, next)
})

export const forgetPassword = (catchAsync(async (req, res, next) => {
    const {
        email
    } = req.body
    if (!email)
        return next(new AppError('Please provide your email address!', 404))

    if (!(await UserModel.exists({
            email
        }))) {
        return next(new AppError('This email doesn\'t belong to any account! Check your email again.', 404))
    }
}))