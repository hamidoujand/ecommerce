let { Types } = require("mongoose");

module.exports = class Cart {
  constructor(previousCard = {}) {
    this.products = previousCard.products ? [...previousCard.products] : [];
    this.totalPrice = previousCard.totalPrice ? previousCard.totalPrice : 0;
  }

  addToCard(product) {
    product = product.toObject();
    product.quantity = undefined;
    let founded = this.products.find((prod) => prod.name === product.name);
    if (founded) {
      founded.cartQuantity++;
    } else {
      product.cartQuantity = 1;
      this.products.push(product);
    }
    this.calculateTotalPrice();
  }
  removeFromCart(name) {
    let product = this.products.find((prod) => prod.name === name);
    if (!product) return;
    if (product.cartQuantity > 0) {
      product.cartQuantity--;
    }
    if (product.cartQuantity === 0) {
      this.products = this.products.filter((prod) => prod.name !== name);
    }

    this.calculateTotalPrice();
  }
  calculateTotalPrice() {
    let totalPrice = this.products.reduce(
      (total, prod) => (total += prod.price * prod.cartQuantity),
      0
    );
    this.totalPrice = totalPrice;
  }
};
