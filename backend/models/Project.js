const mongoose = require("mongoose");

/*
 * Projects added by the admin. They appear on the public website
 * next to the built-in projects.
 * Screenshots are stored in the database and served by the image route.
 */
const projectSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true, maxlength: 80 },
    category: { type: String, default: "Website", trim: true, maxlength: 60 },
    description: { type: String, required: true, trim: true, maxlength: 400 },
    status: {
      type: String,
      enum: ["Live", "In progress", "Completed", "Coming soon"],
      default: "Live",
    },
    href: { type: String, default: "", trim: true },
    technologies: { type: [String], default: [] },

    details: {
      overview: { type: [String], default: [] },
      scope: { type: [String], default: [] },
      fit: { type: [String], default: [] },
    },

    images: [
      {
        _id: false,
        data: { type: Buffer, required: true },
        contentType: { type: String, required: true },
      },
    ],

    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
