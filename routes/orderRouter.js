const express = require('express')
const orderRouter = express.Router()

orderRouter.route('/').get()

module.exports = orderRouter