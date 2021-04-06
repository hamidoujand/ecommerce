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
  sendJwt(user, req, res, 201);
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
  sendJwt(user, req, res, 200);
});

exports.isAuthenticated = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers["authorization"] &&
    req.headers["authorization"].startsWith("Bearer")
  ) {
    token = req.headers["authorization"].split(" ")[1];
  } else if (req.cookies.jwtToken) {
    token = req.cookies.jwtToken;
  }

  if (!token) {
    return next(new AppError("please login to get access", 401));
  }

  let { _id, iat } = jwt.verify(token, process.env.JWT_SECRET);
  let user = await User.findById(_id);
  if (!user) {
    return next(
      new AppError("no user related to this token please signup", 401)
    );
  }
  //here we check if user recently changed his password
  let isPassRecentlyChanged = user.isPasswordRecentlyChanged(iat);
  if (isPassRecentlyChanged) {
    return next(
      new AppError("password recently changed please login again", 401)
    );
  }
  //here we good to go and put the user in request
  req.user = user;
  next();
});

exports.changePassword = catchAsync(async (req, res, next) => {
  let { password, newPassword, newPasswordConfirm } = req.body;
  //get the user from db
  let user = await User.findOne({ _id: req.user._id }).select("+password");
  //now we compare the hashed version of the pass user sent with what actually is in DB
  let isPasswordMatch = await user.isPasswordMatch(user.password, password);
  if (!isPasswordMatch) {
    return next(new AppError("invalid password", 400));
  }
  //here we change the password
  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;
  await user.save();
  //login the user
  sendJwt(user, req, res, 200);
});
