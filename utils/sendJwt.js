let jwt = require("jsonwebtoken");

module.exports = (user, res, statusCode) => {
  let token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    user,
  });
};
