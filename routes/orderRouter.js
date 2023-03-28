import express from 'express'
import { isLoggedIn } from '../controllers/authController.js'
import { createOrder, getAllOrders } from '../controllers/orderController.js'

const orderRouter = express.Router()

orderRouter.route('/').get(isLoggedIn, getAllOrders)
    .post(isLoggedIn, createOrder)

export default orderRouter