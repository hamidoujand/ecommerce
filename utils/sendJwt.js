let jwt = require("jsonwebtoken");

module.exports = (user, req, res, statusCode) => {
  let token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  //also add the token into the Cookie
  res.cookie("jwtToken", token, {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure:
      (req.secure || req.headers["x-forwarded-proto"] === "https") && true,
  });
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    user,
  });
};
