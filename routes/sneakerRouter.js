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
  createSneakerCategory,
  deleteExcept,
  getCategoriesBySneaker,
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

sneakerRouter
  .route("/:slug/categories").get(getCategoriesBySneaker).delete(deleteExcept)

sneakerRouter
  .route("/:slug/favorite")
  .post(isLoggedIn, favoriteSneaker)

sneakerRouter.route('/:slug/reviews').post(isLoggedIn, createReview)

export default sneakerRouter;