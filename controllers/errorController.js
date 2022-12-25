const AppError = require('../utils/appError')

const generateCastError = err => {
    let message = `Invalid ${err.path}: ${err.value}`
    return new AppError(message, 400)
}

const generateDuplicateError = err => {
    let message = `Duplicated value: ${err.keyValue}`
    return new AppError(message, 400)
}

const generateValidationError = err => {
    const errors = Object.values(err.errors).map(el => el.message)
    let message = `Invalid input data: ${errors.join('. ')}`
    return new AppError(message, 400)
}

const generateInvalidJWTError = err => {
    return new AppError('Invalid token! Please log in again.', 401)
}

const generateExpiredJWTError = err => {
    return new AppError('Token expired! Please log in again.', 401)
}

const sendErrorDev = (req, res, err) => {
    if (req.originalUrl.startsWith('/api'))
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        })
    return res.status(err.statusCode).json({
        status: "fail",
        message: "Something went very wrong"
    })
}

const sendErrorProd = (req, res, err) => {
    if (req.originalUrl.startsWith('/api')) {
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            })
        }
        return res.status(err.statusCode).render('error', {
            title: "Something went very wrong!"
        })
    }
    if (err.isOperational) {
        return res.status(err.statusCode).render('error', {
            title: "Something went wrong!",
            message: err.message
        })
    }
    return res.status(err.statusCode).render('error', {
        title: "Something went wrong!",
        message: "Try again later"
    })
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(req, res, err)
    } else {
        let error = {...err}
        if (err.name === 'CastError') error = generateCastError(error)
        if (err.code === 11000) error = generateDuplicateError(error)
        if (err.name === 'ValidationError') error = generateValidationError(error)
        if (err.name === 'JsonWebTokenError') error = generateInvalidJWTError(error)
        if (err.name === 'TokenExpiredError')
            error = generateExpiredJWTError(error)
        sendErrorProd(req, res, error)
    }
}