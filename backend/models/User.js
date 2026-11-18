const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    // Hash of a random key kept in the visitor's browser. It stops someone
    // else from opening this email's chat by typing the same address.
    visitorKeyHash: {
      type: String,
      default: null,
      select: false,
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    // 🟢 Customer online status
    online: {
      type: Boolean,
      default: false,
    },

    // 🕒 Last seen
    lastSeen: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);