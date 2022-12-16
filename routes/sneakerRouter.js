const express = require('express')
const sneakerRouter = express.Router()

const sneakerCtrler = require('../controllers/sneakerControllers')

sneakerRouter.post('/', sneakerCtrler.createSneaker)

module.exports = sneakerRouter