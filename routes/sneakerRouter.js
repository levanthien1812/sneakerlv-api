const express = require("express");
const sneakerRouter = express.Router();

const sneakerCtrler = require("../controllers/sneakerController");

sneakerRouter
  .route("/")
  .post(sneakerCtrler.createSneaker)
  .get(sneakerCtrler.getSneakers);

module.exports = sneakerRouter;
