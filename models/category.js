const mongoose = require("mongoose");

/**
 * Category Schema
 * Defines the structure of a Category document in MongoDB.
 *
 * Fields:
 * - name: The name of the category.
 *   - Required, unique, trimmed.
 * - description: (Optional) A short description of the category.
 */
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a category name"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

// Prevent model overwrite in development/testing
module.exports =
  mongoose.models.Category || mongoose.model("Category", categorySchema);
