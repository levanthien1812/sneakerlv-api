import express from 'express'
import { isLoggedIn } from '../controllers/authController.js'
import { deleteCarts, getAllCarts, updateCart } from '../controllers/cartController.js'
const cartRouter = express.Router()

cartRouter.route('/').get(isLoggedIn, getAllCarts)
    .delete(isLoggedIn, deleteCarts)

cartRouter.route('/:id').patch(isLoggedIn, updateCart)

export default cartRouter