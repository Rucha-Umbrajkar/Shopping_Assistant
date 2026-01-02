const express = require("express");
const app = express();
const Cart = require("./models/cart.model");
const cors = require("cors");
const Order = require("./models/order.model");
const UserContext = require("./models/userContext.model");
require("dotenv").config();

app.use(
  cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

const mongoose = require("mongoose");
const User = require("./models/user.model");
const Product = require("./models/product.model.js");
const Category = require("./models/category.model.js");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to the database");
  })
  .catch(() => {
    console.log("Connection Failed! ");
  });

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.post("/api/users", async (req, res) => {
  try {
    const user = await User.create(req.body); // <-- capture return value
    res.status(200).json(user); // now it's defined ✔️
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.delete("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, req.body);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await User.findById(id);

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify password
    const isMatch = user.password === password; // (simple version — no hashing)

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.status(200).json({
      message: "Login successful",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/products", async (req, res) => {
  try {
    const product = await Product.create(req.body); // <-- capture return value
    res.status(200).json(product); // now it's defined ✔️
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

//Display all the products
//
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find({}).populate(
      "categoryIds",
      "name slug"
    );

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate(
      "categoryIds",
      "name slug"
    );
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.put("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updatedProduct = await Product.findById(id);

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// delete a product

app.delete("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/category", async (req, res) => {
  try {
    const category = await Category.create(req.body); // <-- capture return value
    res.status(200).json(category); // now it's defined ✔️
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

//Display all the products
//
app.get("/api/category", async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/category/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.put("/api/category/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(id, req.body);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const updatedCategory = await Category.findById(id);
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// delete a product

app.delete("/api/category/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/cart", async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [
          {
            productId,
            quantity: 1,
            priceAtAddTime: product.price,
          },
        ],
      });
    } else {
      const item = cart.items.find((i) => i.productId.toString() === productId);

      if (item) {
        item.quantity += 1;
      } else {
        cart.items.push({
          productId,
          quantity: 1,
          priceAtAddTime: product.price,
        });
      }
    }

    cart.calculateTotals();
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/cart/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate(
      "items.productId",
      "title price images"
    );

    res
      .status(200)
      .json(cart || { items: [], totalQuantity: 0, totalPrice: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/api/cart", async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find((i) => i.productId.toString() === productId);

    if (!item) {
      return res.status(404).json({ message: "Item not in cart" });
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter(
        (i) => i.productId.toString() !== productId
      );
    } else {
      item.quantity = quantity;
    }

    cart.calculateTotals();
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/api/cart", async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter((i) => i.productId.toString() !== productId);

    cart.calculateTotals();
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/api/cart", async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const cart = await Cart.findOne({ userId });

    // 1️⃣ Cart not found
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // 2️⃣ Cart empty
    if (cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is already empty" });
    }

    // 3️⃣ Check if item exists
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // 4️⃣ Remove item
    cart.items.splice(itemIndex, 1);

    await cart.save();

    res.status(200).json({
      message: "Item removed successfully",
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// routes/order.js
app.post("/api/checkout", async (req, res) => {
  try {
    const { userId, address } = req.body;

    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const items = cart.items.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.productId.price,
    }));

    const totalAmount = items.reduce((sum, i) => sum + i.quantity * i.price, 0);

    const order = await Order.create({
      userId,
      items,
      totalAmount,
      address,
    });

    // clear cart after order
    cart.items = [];
    await cart.save();

    res.status(201).json({ message: "Order placed", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/:userId - fetch all orders for a user
app.get("/api/orders/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // fetch orders for this user, most recent first
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .populate("items.productId", "title price images");

    res.status(200).json({ orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/user-context", async (req, res) => {
  try {
    const { userId, lastIntent, lastSearchQuery, lastCategory, lastPlatform } =
      req.body;

    const context = await UserContext.findOneAndUpdate(
      { userId },
      {
        lastIntent,
        lastSearchQuery,
        lastCategory,
        lastPlatform,
        updatedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    res.status(200).json(context);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/user-context/:userId", async (req, res) => {
  try {
    const context = await UserContext.findOne({
      userId: req.params.userId,
    });

    res.status(200).json(context || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/api/user-context/:userId", async (req, res) => {
  try {
    await UserContext.findOneAndDelete({
      userId: req.params.userId,
    });

    res.status(200).json({ message: "User context cleared" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
