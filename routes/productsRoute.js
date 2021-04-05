let router = require("express").Router();
let productController = require("../controllers/productController");
let usersController = require("../controllers/userController");
let restrictTo = require("../utils/restrictTo");
let cardRouter = require("./cartsRoute");

//Cart Router
router.use("/:productId/add-to-cart", cardRouter);

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

module.exports = router;
