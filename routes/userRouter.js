import express from 'express'
import {
    createGoogleUser,
    isLoggedIn,
    logIn,
    logOut,
    signUp,
    updatePassword
} from '../controllers/authController.js'
import {
    createShippingInfo,
    deleteShippingInfo,
    getShippingInfo,
    getUser,
    updateShippingInfo
} from '../controllers/userController.js'

const userRouter = express.Router()

userRouter.route('/sign-up').post(signUp)
userRouter.route('/create-google-user').post(createGoogleUser)
userRouter.route('/log-in').post(logIn)
userRouter.route('/log-out').post(logOut)

userRouter.route('/shipping-info').post(isLoggedIn, createShippingInfo)
    .get(isLoggedIn, getShippingInfo)

userRouter.route('/shipping-info/:id').patch(isLoggedIn, updateShippingInfo)
    .delete(isLoggedIn, deleteShippingInfo)

userRouter.route('/account/profile').get(isLoggedIn, getUser)
userRouter.route('/account/update-password').post(isLoggedIn, updatePassword)

export default userRouter