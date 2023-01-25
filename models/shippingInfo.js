const mongoose = require('mongoose')

const ShippingInfoSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'Please provide your name!'],
    },
    address: {
        type: String,
        require: [true, 'Please provide your address!'],
    },
    phoneNum: {
        type: String,
        require: [true, 'Please provide your phone number']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('ShippinInfo', ShippingInfoSchema)
