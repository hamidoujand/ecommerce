let Product = require("../models/Product");
let catchAsync = require("../utils/catchAsync");
let multer = require("multer");
const AppError = require("../utils/AppError");
let sharp = require("sharp");
let path = require("path");
let deletePhoto = require("../utils/deletePhoto");
let Cart = require("../models/Cart");
let ApiFeatures = require("../utils/ApiFeatures");
let stripe = require("stripe")(process.env.STRIPE_SECRET);

let multerStorage = multer.memoryStorage();

exports.upload = multer({
  storage: multerStorage,
  fileFilter(req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      return cb(null, true);
    } else {
      return cb(new AppError("please upload an image", 400));
    }
  },
});

exports.resizeImages = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  let filename = `product-${req.user._id}-${Date.now()}.jpeg`;
  let diskPath = path.join(__dirname, `../public/images/products/${filename}`);
  req.filename = filename;
  await sharp(req.file.buffer).toFormat("jpeg").jpeg(80).toFile(diskPath);
  next();
});

exports.createProduct = catchAsync(async (req, res, next) => {
  let product = await Product.create({ image: req.filename, ...req.body });
  res.status(201).json({
    status: "success",
    product,
  });
});

exports.getAllProducts = catchAsync(async (req, res, next) => {
  let queryString = req.query;
  let mongoQuery = Product.find();
  let api = new ApiFeatures(mongoQuery, queryString);
  let query = api.filter().sort().paginate().mongoQuery;
  let products = await query;
  res.status(200).json({
    status: "success",
    result: products.length,
    products,
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  let id = req.params.productId;
  let product = await Product.findByIdAndDelete(id);
  if (!product) {
    return next(new AppError("there is no product with this id", 404));
  }
  res.status(204).json({
    status: "success",
    product: product,
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  let data = { ...req.body };
  let product = await Product.findById(req.params.productId);
  if (!product)
    return next(new AppError("there is no product with this id", 404));

  if (req.filename) {
    data.image = req.filename;
    await deletePhoto(product.image);
  }
  let updatedProduct = await Product.findOneAndUpdate(
    { _id: product._id },
    data,
    {
      new: true,
      runValidators: true,
    }
  );

  res.json({
    status: "success",
    product: updatedProduct,
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  let product = await Product.findById(req.params.productId);
  if (!product) return next(new AppError("product not found", 404));
  //delete the photo
  await deletePhoto(product.image);
  await product.delete();
  res.status(204).json({ status: "success" });
});

exports.getSingleProduct = catchAsync(async (req, res, next) => {
  let product = await Product.findById(req.params.productId);
  if (!product) return next(new AppError("product not found", 404));
  res.json({
    status: "success",
    product,
  });
});

exports.addToCart = catchAsync(async (req, res, next) => {
  let product = await Product.findById(req.params.productId);
  // first we check it we have the product in stock
  if (!product) return next(new AppError("product not found", 404));
  if (product.quantity === 0) return next(new AppError("sold out", 404));
  //here we create a cart obj for this person
  let cart = new Cart(req.session.cart);
  cart.addToCard(product);
  req.session.cart = cart;
  await product.updateOne({ $inc: { quantity: -1 } });
  res.json({
    status: "success",
    cart,
  });
});

exports.removeFromCart = catchAsync(async (req, res, next) => {
  let productId = req.params.productId;
  let product = await Product.findById(productId);
  if (!product) return next(new AppError("product not found", 404));
  let cart = new Cart(req.session.cart);
  cart.removeFromCart(product.name);
  req.session.cart = cart;
  await product.updateOne({ $inc: { quantity: 1 } });
  res.json({
    status: "success",
    cart,
  });
});

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  let cart = req.session.cart;
  let session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${req.protocol}://${req.get("host")}/`,
    cancel_url: `${req.protocol}://${req.get("host")}/`,
    customer_email: req.user.email,
    client_reference_id: req.user._id.toString(),
    line_items: [
      {
        name: "EC",
        amount: cart.totalPrice * 100,
        currency: "usd",
        quantity: req.session.cart.products.length,
      },
    ],
  });
  res.status(200).json({
    status: "success",
    session,
  });
});
