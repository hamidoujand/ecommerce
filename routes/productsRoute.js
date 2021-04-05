let router = require("express").Router();
let productController = require("../controllers/productController");
let usersController = require("../controllers/userController");
let restrictTo = require("../utils/restrictTo");

router
  .route("/")
  .post(
    usersController.isAuthenticated,
    productController.upload.single("image"),
    productController.resizeImages,
    restrictTo("admin"),
    productController.createProduct
  )
  .get(productController.getAllProducts);

router
  .route("/:productId")
  .delete(
    usersController.isAuthenticated,
    restrictTo("admin"),
    productController.deleteProduct
  )
  .patch(
    usersController.isAuthenticated,
    restrictTo("admin"),
    productController.upload.single("image"),
    productController.resizeImages,
    productController.updateProduct
  )
  .delete(
    usersController.isAuthenticated,
    restrictTo("admin"),
    productController.deleteProduct
  )
  .get(productController.getSingleProduct);

router.get("/add-to-cart/:productId", productController.addToCart);

module.exports = router;
