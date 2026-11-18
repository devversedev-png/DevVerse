const mongoose = require("mongoose");

/*
 * One document per visitor email.
 * "visitCount" goes up once for each separate visit (see leadController).
 */
const leadSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    visitCount: {
      type: Number,
      default: 1,
    },

    firstVisitAt: {
      type: Date,
      default: Date.now,
    },

    lastVisitAt: {
      type: Date,
      default: Date.now,
    },

    lastPath: {
      type: String,
      default: "/",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Lead", leadSchema);
