const mongoose = require('mongoose')

const Brand = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide the name of brand']
    }
})