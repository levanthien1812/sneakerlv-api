import express from "express";
const sneakerRouter = express.Router();

import {
  createReview
} from "../controllers/reviewController.js";
import {
  isLoggedIn,
  restrictsTo
} from "../controllers/authController.js"
import {
  createSneaker,
  getSneaker,
  getSneakers,
  updateSneaker,
  deleteSneaker,
  favoriteSneaker,
  uploadSneakerImages
} from "../controllers/sneakerController.js"

import {
  createCart
} from "../controllers/cartController.js";
import {
  createSneakerCategory,
  uploadCategoryImage
} from "../controllers/sneakerCategoryController.js";

sneakerRouter
  .route("/")
  .post(uploadSneakerImages, createSneaker)
  .get(getSneakers)

sneakerRouter
  .route('/categories')
  .post(uploadCategoryImage, createSneakerCategory)

sneakerRouter
  .route("/:slug")
  .get(getSneaker)
  .patch(isLoggedIn, updateSneaker)
  .delete(isLoggedIn, deleteSneaker)
  .post(isLoggedIn, restrictsTo('customer'), createCart)

sneakerRouter
  .route("/:slug/favorite")
  .post(isLoggedIn, favoriteSneaker)

sneakerRouter.route('/:slug/reviews').post(isLoggedIn, createReview)

export default sneakerRouter;