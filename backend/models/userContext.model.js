const mongoose = require("mongoose");

const UserContextSchema = new mongoose.Schema(
  {
    userId: {
      type: String, // phone number / userId
      required: true,
      unique: true,
    },

    lastIntent: {
      type: String,
      default: null,
    },

    lastSearchQuery: {
      type: String,
      default: null,
    },

    lastCategory: {
      type: String,
      default: null,
    },

    lastPlatform: {
      type: String,
      enum: ["whatsapp", "web", "chatbot"],
      default: "web",
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserContext", UserContextSchema);
