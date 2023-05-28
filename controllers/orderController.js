import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import Order from "../models/order.js";
import Cart from "../models/cart.js";
import ShippingInfo from "../models/shippingInfo.js";

export const createOrder = catchAsync(async (req, res, next) => {
  // Splits carts string of ids into arrays of ids
  const { cartItems, shippingInfo, paymentMethod, shippingFee, totalPrice } =
    req.body;
  const cartItemIds = cartItems.map((cartItem) => cartItem._id);

  const newOrder = await Order.create({
    user: req.user._id,
    cartItems: cartItemIds,
    shippingInfo: shippingInfo._id,
    paymentMethod,
    shippingFee,
    totalPrice,
  });

  // Unactive cart(s) after creating order
  cartItemIds.forEach(async (id) => {
    await Cart.findByIdAndUpdate(id, {
      active: false,
    });
  });

  return res.status(200).json({
    status: "success",
    data: newOrder,
  });
});

export const getAllOrders = catchAsync(async (req, res, next) => {
  const status = req.query.status || null;
  let orders = [];
  console.log(status)
  if (!status) {
    orders = await Order.find({ user: req.user._id });
  } else orders = await Order.find({ user: req.user._id, status });

  return res.status(200).json({
    status: "success",
    quantity: orders.length,
    data: orders,
  });
});

export const deleteOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  // Không được hủy đơn hàng sau khi giao cho đơn vị vận chuyển
  if (order.state.includes("giao cho đơn vị vận chuyển")) {
    return res.status(200).json({
      status: "fail",
      message: "Can not cancel order! Your parcel is being shipped to you.",
    });
  }

  await Order.findOneAndDelete(req.params.id);
  res.status(200).json({
    status: "success",
  });
});
