const express = require('express')
const userRouter = express.Router()
const authController = require('../controllers/authController')
const userController = require('../controllers/userController')

userRouter.route('/sign-up').post(authController.signUp)
userRouter.route('/log-in').post(authController.logIn)
userRouter.route('/log-out').post(authController.logOut)

userRouter.route('/shipping-info').post(authController.isLoggedIn, userController.createShippingInfo)
    .get(authController.isLoggedIn, userController.getShippingInfo)

userRouter.route('/shipping-info/:id').patch(authController.isLoggedIn, userController.updateShippingInfo)
    .delete(authController.isLoggedIn, userController.deleteShippingInfo)

module.exports = userRouter