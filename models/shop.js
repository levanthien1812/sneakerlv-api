import mongoose from "mongoose";

const ShopSchema = new mongoose.Schema({
    location: [{
        type: String,
    }],
    sizeConversion: {
        type: String,
        require: true
    }
})