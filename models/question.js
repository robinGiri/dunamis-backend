const mongoose = require("mongoose");

/**
 * Question Schema
 * Defines the structure of a quiz question in MongoDB.
 *
 * Fields:
 * - questionText: The quiz question text.
 * - options: An array of possible answer strings.
 * - correctAnswer: The correct answer string.
 */
const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: [true, "Please provide the question text"],
  },
  options: [
    {
      type: String,
      required: [true, "Please provide an option"],
    },
  ],
  correctAnswer: {
    type: String,
    required: [true, "Please provide the correct answer"],
  },
});

module.exports =
  mongoose.models.Question || mongoose.model("Question", questionSchema);
