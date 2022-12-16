const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const bodyParser  = require('body-parser')

const sneakerRouter = require('./routes/sneakerRouter')

const app = express()

// Use view engine
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

// Body-parser and cookie-parser
app.use(bodyParser.json())
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))
app.use(cookieParser())

// Serving static files
app.use(express.static('public'))

app.use('/api/sneakers', sneakerRouter)

module.exports = app