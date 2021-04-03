let Product = require("../models/Product");
let catchAsync = require("../utils/catchAsync");

exports.createProduct = catchAsync(async (req, res, next) => {
  let product = await Product.create(req.body);
  res.status(201).json({
    status: "success",
    product,
  });
});
