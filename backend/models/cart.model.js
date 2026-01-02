const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    priceAtAddTime: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // better than unique:true
    },

    items: [cartItemSchema],

    totalQuantity: {
      type: Number,
      default: 0,
    },

    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// 🔥 Auto calculate totals before save
cartSchema.methods.calculateTotals = function () {
  let quantity = 0;
  let price = 0;

  this.items.forEach((item) => {
    quantity += item.quantity;
    price += item.quantity * item.priceAtAddTime;
  });

  this.totalQuantity = quantity;
  this.totalPrice = price;
};

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
