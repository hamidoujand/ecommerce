let AppError = require("./AppError");

module.exports = (...roles) => {
  return (req, res, next) => {
    if (roles.includes(req.user.role)) {
      return next();
    } else {
      return next(
        new AppError("you are not authorized to access this route", 401)
      );
    }
  };
};
