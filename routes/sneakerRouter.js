const express = require("express");
const sneakerRouter = express.Router();

const { createReview } = require("../controllers/reviewController");
const { isLoggedIn, restrictsTo } = require("../controllers/authController")
const {
  createSneaker,
  getSneaker,
  getSneakers,
  updateSneaker,
  deleteSneaker,
  createCart,
  favoriteSneaker
} = require("../controllers/sneakerController")

sneakerRouter
  .route("/")
  .post(createSneaker)
  .get(getSneakers)

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

module.exports = sneakerRouter;