import mongoose from "mongoose";

const ShippingInfoSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "Please provide your name!"],
  },
  address: {
    province: { type: String },
    district: { type: String },
    ward: { type: String },
    street: { type: String },
  },
  phoneNum: {
    type: String,
    require: [true, "Please provide your phone number"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  isDefault: Boolean,
});

export default mongoose.model("ShippinInfo", ShippingInfoSchema);
