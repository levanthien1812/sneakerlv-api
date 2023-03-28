import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import sneakerRouter from './routes/sneakerRouter.js'
import userRouter from './routes/userRouter.js'
import orderRouter from './routes/orderRouter.js'
import cartRouter from './routes/cartRouter.js'
import errorController from './controllers/errorController.js'

const app = express()

// Body-parser and cookie-parser
app.use(bodyParser.json())
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))
app.use(cookieParser())

// Serving static files
app.use(express.static('public'))

// Routes
app.use('/api/sneakers', sneakerRouter)
app.use('/api/users', userRouter)
app.use('/api/orders', orderRouter)
app.use('/api/carts', cartRouter)

// Use global error handler
// Must be put after routes
app.use(errorController)

export default app