import express from 'express'
import { getAllBrands } from '../controllers/brandController.js'
const brandRouter = express.Router()

brandRouter.route('/').get(getAllBrands)

export default brandRouter