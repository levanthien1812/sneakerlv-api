const express = require("express");
const sneakerRouter = express.Router();

const sneakerCtrler = require("../controllers/sneakerController");

sneakerRouter
  .route("/")
  .post(sneakerCtrler.createSneaker)
  .get(sneakerCtrler.getSneakers);

sneakerRouter
  .route("/:slug")
  .get(sneakerCtrler.getSneaker)
  .patch(sneakerCtrler.updateSneaker)
  .delete(sneakerCtrler.deleteSneaker);

module.exports = sneakerRouter;
