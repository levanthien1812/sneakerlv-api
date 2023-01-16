const express = require('express')
const cartRouter = express.Router()
const cartController = require('../controllers/cartController')
const authController = require('../controllers/authController')

cartRouter.route('/').get(authController.isLoggedIn, cartController.getAllCarts)

module.exports = cartRouter