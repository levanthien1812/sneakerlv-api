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

userRouter.route('/account/profile').get(authController.isLoggedIn, userController.getUser)
userRouter.route('/account/update-password').post(authController.isLoggedIn, authController.updatePassword)

module.exports = userRouter