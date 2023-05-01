import express from 'express'
import { isLoggedIn } from '../controllers/authController.js'
import { deleteCarts, getAllCarts, saveCart, updateCart } from '../controllers/cartController.js'
const cartRouter = express.Router()

cartRouter.route('/').get(isLoggedIn, getAllCarts)
    .delete(isLoggedIn, deleteCarts).post(isLoggedIn, saveCart)

cartRouter.route('/:id').patch(isLoggedIn, updateCart)

export default cartRouter