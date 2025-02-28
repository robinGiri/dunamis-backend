const mongoose = require("mongoose");

/**
 * Course Schema
 * Defines the structure of a course document in MongoDB.
 *
 * Fields:
 * - courseName: The name of the course.
 *   - Required, unique, trimmed, maximum length of 50 characters.
 * - description: A brief description of the course.
 *   - Required and trimmed.
 * - price: The price of the course.
 *   - Required and must be zero or a positive number.
 * - type: Indicates if the course is "free" or "premium".
 *   - Required and must be one of these two values.
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
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Course", courseSchema);
