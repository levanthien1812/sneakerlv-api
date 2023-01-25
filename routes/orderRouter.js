const express = require('express')
const orderRouter = express.Router()
const authController = require('../controllers/authController')
const orderController = require('../controllers/orderController')

orderRouter.route('/').get().post(authController.isLoggedIn, orderController.createOrder)

orderRouter.route('/shipping-info').post(authController.isLoggedIn, orderController.createShippingInfo)

module.exports = orderRouter