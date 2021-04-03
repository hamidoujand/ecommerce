let Product = require("../models/Product");
let catchAsync = require("../utils/catchAsync");
let multer = require("multer");
const AppError = require("../utils/AppError");

let multerStorage = multer.memoryStorage();

let upload = multer({
  storage: multerStorage,
  fileFilter(req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      return cb(null, true);
    } else {
      return cb(new AppError("please upload an image", 400));
    }
  },
});

exports.createProduct = catchAsync(async (req, res, next) => {
  let product = await Product.create(req.body);
  res.status(201).json({
    status: "success",
    product,
  });
});
