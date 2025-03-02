const mongoose = require("mongoose");

/**
 * Question Schema
 * Defines a quiz question with exactly 4 options and a correct answer that must be one of the options.
 *
 * Fields:
 * - questionText: The text of the question.
 * - options: An array of exactly 4 possible answers.
 * - correctAnswer: The correct answer (must match one of the options).
 * - category: (Optional) Category for filtering questions.
 */
const questionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: [true, "Please provide the question text"],
      trim: true,
    },
    options: {
      type: [String],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length === 4;
        },
        message: "Exactly 4 options are required",
      },
      required: [true, "Please provide options"],
    },
    correctAnswer: {
      type: String,
      required: [true, "Please provide the correct answer"],
      // We remove the inline validator since 'this' might not be available during update.
    },
    category: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

// Pre-save hook to validate that correctAnswer is one of the options
questionSchema.pre("save", function (next) {
  if (!Array.isArray(this.options) || !this.options.includes(this.correctAnswer)) {
    return next(new Error("Correct answer must be one of the options"));
  }
  next();
});

module.exports = mongoose.models.Question || mongoose.model("Question", questionSchema);
