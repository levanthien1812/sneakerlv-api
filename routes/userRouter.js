import express from "express";
import {
  createGoogleUser,
  isLoggedIn,
  logIn,
  logOut,
  signUp,
  updatePassword,
  verifyEmail,
} from "../controllers/authController.js";
import {
  createShippingInfo,
  deleteShippingInfo,
  getShippingInfo,
  getUser,
  updateShippingInfo,
  updateUser,
  uploadUserPhoto,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.route("/sign-up").post(signUp);
userRouter.route("/sign-up/verify").post(verifyEmail);
userRouter.route("/create-google-user").post(createGoogleUser);
userRouter.route("/log-in").post(logIn);
userRouter.route("/log-out").post(logOut);

userRouter
  .route("/shipping-info")
  .post(isLoggedIn, createShippingInfo)
  .get(isLoggedIn, getShippingInfo);

userRouter
  .route("/shipping-info/:id")
  .patch(isLoggedIn, updateShippingInfo)
  .delete(isLoggedIn, deleteShippingInfo);

userRouter
  .route("/account/profile")
  .get(isLoggedIn, getUser)
  .patch(isLoggedIn, uploadUserPhoto, updateUser);
userRouter.route("/account/update-password").post(isLoggedIn, updatePassword);

export default userRouter;
