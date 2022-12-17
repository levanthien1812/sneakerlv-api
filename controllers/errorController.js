const AppError = require('../utils/appError')

function sendErrorDev(req, res, err) {
    if (req.originalUrl.startsWith('/api'))
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        })
    return res.status(err.statusCode).json({
        status: "fail",
        message: "Some thing went very wrong"
    })
}

function sendErrorProd(req, res, err) {
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
        sendErrorDev(err, req, res)
    } else {
        
    }
}