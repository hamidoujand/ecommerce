let router = require("express").Router();
let productController = require("../controllers/productController");
let usersController = require("../controllers/userController");

router
  .route("/")
  .post(usersController.isAuthenticated, productController.createProduct);

module.exports = router;
