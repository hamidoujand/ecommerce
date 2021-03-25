let catchAsync = require("../utils/catchAsync");
let User = require("../models/User");
let sendJwt = require("../utils/sendJwt");
let AppError = require("../utils/AppError");
let jwt = require("jsonwebtoken");

exports.signup = catchAsync(async (req, res, next) => {
  let { username, password, passwordConfirm, email } = req.body;
  let user = await User.create({
    username,
    email,
    password,
    passwordConfirm,
  });
  sendJwt(user, res, 201);
});

exports.signin = catchAsync(async (req, res, next) => {
  let { email, password } = req.body;
  let user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new AppError("invalid email or password", 400));
  }
  let isMatch = await user.isPasswordMatch(user.password, password);
  if (!isMatch) {
    return next(new AppError("invalid email or password", 400));
  }
  sendJwt(user, res, 200);
});

exports.isAuthenticated = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers["authorization"] &&
    req.headers["authorization"].startsWith("Bearer")
  ) {
    token = req.headers["authorization"].split(" ")[1];
  }

  if (!token) {
    return next(new AppError("please login to get access", 401));
  }

  let { _id } = jwt.verify(token, process.env.JWT_SECRET);
  let user = await User.findById(_id);
  if (!user) {
    return next(
      new AppError("no user related to this token please signup", 401)
    );
  }
});
