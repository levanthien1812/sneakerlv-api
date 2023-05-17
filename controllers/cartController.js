import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import Cart from "../models/cart.js";
import Sneaker from "../models/sneaker.js";

export const getAllCarts = catchAsync(async (req, res, next) => {
  const limit = req.query.quantity || Infinity;

  const carts = await Cart.find({
    user: req.user._id,
    active: true,
  })
    .sort({
      createdAt: -1,
    })
    .limit(limit);

  return res.status(200).json({
    status: "success",
    quantity: carts.length,
    data: carts,
  });
});

export const saveCart = catchAsync(async (req, res, next) => {
  const cartItemsReq = req.body.cartItems || [];

  // console.log(req.body)

  await Cart.deleteMany({
    user: req.user._id,
  });

  const cartItemsRes = [];

  await Promise.all(
    cartItemsReq.map(async (cartItem) => {
      const { sneaker, category, quantity, isChosen } = cartItem;
      const existingSneaker = await Sneaker.findById(sneaker._id);
      if (!existingSneaker)
        return new AppError("This sneaker is not available!");

      let newCartItem = await Cart.create({
        user: req.user._id,
        quantity,
        category: category._id,
          sneaker: sneaker._id,
        isChosen,
      });
        
      await newCartItem.populate(
        "sneaker",
        "_id id slug name coverImage brand rating"
      );
      await newCartItem.populate("category");

      if (!newCartItem) {
        return res.status(500).json({
          status: "fail",
          message: "fail to save item to cart",
        });
      }

      cartItemsRes.push(newCartItem);
    })
  );

  return res.status(200).json({
    status: "success",
    data: cartItemsRes,
  });
});

export const deleteCarts = catchAsync(async (req, res, next) => {
  const ids = req.query.ids.split(",");

  ids.forEach(async (id) => {
    await Cart.findByIdAndDelete(id);
  });

  return res.status(200).json({
    status: "success",
  });
});

export const updateCart = catchAsync(async (req, res, next) => {
  const { quantity, size } = req.body;
  const cartToUpdate = await Cart.findById(req.params.id);

  if (quantity) cartToUpdate.quantity = quantity;
  if (size) cartToUpdate.size = size;

  if (cartToUpdate.quantity === 0) {
    await Cart.findByIdAndDelete(cartToUpdate.id);
  } else {
    await cartToUpdate.save();
  }

  return res.status(200).json({
    status: "success",
    data: cartToUpdate,
  });
});
