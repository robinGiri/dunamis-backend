const mongoose = require("mongoose");

/**
 * Course Schema
 * Defines the structure of a Course document in MongoDB.
 *
 * Fields:
 * - courseName: The name of the course.
 *   - Required, unique, trimmed, maximum length of 50 characters.
 * - description: A description of the course.
 *   - Required and trimmed.
 * - price: The price of the course.
 *   - Required and must be zero or greater.
 * - type: Indicates if the course is "free" or "premium".
 *   - Required and must be one of these two values.
 * - author: The author of the course.
 *   - Optional, defaults to "Unknown Author".
 * - category: The category of the course.
 *   - Optional, defaults to "General".
 * - img: A URL for an image representing the course.
 *   - Optional, defaults to an empty string (or a placeholder URL if desired).
 */
const courseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: [true, "Please add a course name"],
      unique: true,
      trim: true,
      maxlength: [50, "Course name cannot be more than 50 characters"],
    },
    description: {
      type: String,
      required: [true, "Please add a course description"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Please add a price for the course"],
      min: [0, "Price cannot be negative"],
    },
    type: {
      type: String,
      required: [true, "Please specify if the course is free or premium"],
      enum: {
        values: ["free", "premium"],
        message: 'Course type must be either "free" or "premium"',
      },
    },
    author: {
      type: String,
      trim: true,
      default: "Unknown Author",
    },
    category: {
      type: String,
      trim: true,
      default: "General",
    },
    img: {
      type: String,
      trim: true,
      default: "",
    },
    videoId: {
      type: String,
      trim: true,
      default: "",
    },
    courseContain: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

// Prevent overwriting model if already compiled (useful in development/tests)
module.exports = mongoose.models.Course || mongoose.model("Course", courseSchema);
