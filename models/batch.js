const mongoose = require("mongoose");

/**
 * Batch Schema
 * Defines the structure of a Batch document in MongoDB.
 *
 * Fields:
 * - batchName: The name of the batch.
 *   - Required, unique, trimmed.
 *   - Maximum length: 20 characters.
 */
const batchSchema = new mongoose.Schema({
  batchName: {
    type: String,
    required: [true, "Please add a batch name"],
    unique: true,
    trim: true,
    maxlength: [20, "Batch name cannot be more than 20 characters"],
  },
});

// Prevent model overwrite when tests are re-run
module.exports = mongoose.models.Batch || mongoose.model("Batch", batchSchema);
