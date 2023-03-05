const express = require("express");
const sneakerRouter = express.Router();

const sneakerCtrler = require("../controllers/sneakerController");
const authController = require('../controllers/authController')

sneakerRouter
  .route("/")
  .post(sneakerCtrler.createSneaker)
  .get(sneakerCtrler.getSneakers)

sneakerRouter
  .route("/:slug")
  .get(sneakerCtrler.getSneaker)
  .patch(authController.isLoggedIn, sneakerCtrler.updateSneaker)
  .delete(authController.isLoggedIn, sneakerCtrler.deleteSneaker)
  .post(authController.isLoggedIn, authController.restrictsTo('customer'), sneakerCtrler.createCart)

sneakerRouter
  .route("/:slug/favorite")
  .post(authController.isLoggedIn, sneakerCtrler.favoriteSneaker)

module.exports = sneakerRouter;