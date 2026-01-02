const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["admin", "seller", "customer", "user"],
      default: "customer",
    },

    platform: {
      type: String,
      enum: ["Web", "Android", "iOS", "CHATBOT", "chatbot_agent", "chat"],
      required: true,
    },

    platformUserId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// Export
const User = mongoose.model("User", userSchema);

module.exports = User;
