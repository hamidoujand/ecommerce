let router = require("express").Router();
let productController = require("../controllers/productController");
let usersController = require("../controllers/userController");
let restrictTo = require("../utils/restrictTo");

router
  .route("/")
  .post(
    usersController.isAuthenticated,
    restrictTo("admin"),
    productController.createProduct
  );

module.exports = router;
