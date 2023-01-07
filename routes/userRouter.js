const express = require('express')
const userRouter = express.Router()
const authController = require('../controllers/authController')

userRouter.route('/sign-up').post(authController.signUp)

userRouter.route('/log-in').post(authController.logIn)

module.exports = userRouter