import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'

import shippingInfo from './shippingInfo.js'

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name!']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        validate: [validator.isEmail, 'Please provide a valid email!'],
        unique: [true, 'This email already exists'],
    },
    phoneNum: String,
    role: {
        type: String,
        enum: {
            values: ['admin', 'counseler', 'customer'],
            message: '{VALUE} is not a supported role!'
        },
        default: 'customer'
    },
    password: {
        type: String,
        minLength: [8, 'Password must be at least 8 characters!'],
        maxLength: [30, 'Password must not be longer than 30 characters!'],
        required: [true, 'Please provide your password!']
    },
    address: {
        type: String,
    },
    photo: String,
    gender: {
        type: String,
        enum: {
            values: ['female', 'male', 'other'],
            default: 'femail'
        }
    },
    isGoogleAccount: {
        type: Boolean,
        default: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator: function (val) {
                return this.password === val
            },
            message: 'Your confirmed password is not correct!'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        // Do not return this field
        select: false
    }
})

// Can not use arrow function because THIS is wrong
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    
    this.password = await bcrypt.hash(this.password, 10)
    this.passwordConfirm = undefined
    
    next()
})

UserSchema.post('save',async function () {
    await shippingInfo.create({
        user: this.id,
        name: this.name,
        phoneNum: this.phoneNum,
        address: this.address
    })
})

export default mongoose.model('User', UserSchema)