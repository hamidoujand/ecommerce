let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let cartSchema = new Schema({
  products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "user is required"],
  },
  totalPrice: { type: Number, min: [0, "price can not go below 0"] },
});

let Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
