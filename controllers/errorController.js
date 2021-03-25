let AppError = require("../utils/AppError");

let handleMongooseValidation = (err) => {
  let message = Object.values(err.errors)
    .map((err) => err.message)
    .join(" , ");
  return new AppError(message, 400);
};

module.exports = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let status = err.status || "error";

  if (err.name === "ValidationError") {
    err = handleMongooseValidation(err);
  }

  let resData = {
    status,
    message: err.message,
    err,
  };
  if (process.env.NODE_ENV === "production") {
    delete resData["err"];
  }
  res.status(statusCode).json(resData);
};
