let router = require("express").Router();
let userController = require("../controllers/userController");

router.post("/signup", userController.signup);
router.post("/signin", userController.signin);
router.patch(
  "/change-password",
  userController.isAuthenticated,
  userController.changePassword
);

module.exports = router;
