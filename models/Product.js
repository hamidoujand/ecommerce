let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let productSchema = new Schema({
  name: {
    type: String,
    required: [true, "name is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "description is required"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "price is required"],
    min: [0, "price can not be lower than 0"],
  },
  quantity: {
    type: Number,
    required: [true, "quantity is required"],
  },
  image: {
    type: String,
    required: [true, "image is required"],
  },
});

let Product = mongoose.model("Product", productSchema);

module.exports = Product;
