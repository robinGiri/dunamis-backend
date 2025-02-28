const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");

// Import batch controller functions
const {
  getBatches,
  getBatch,
  createBatch,
  updateBatch,
  deleteBatch,
} = require("../controllers/batch");

/**
 * @route   GET /api/v1/batch/getAllBatches
 * @desc    Get all batches
 * @access  Public
 */
router.get("/getAllBatches", getBatches);

/**
 * @route   GET /api/v1/batch/:id
 * @desc    Get a single batch by ID
 * @access  Public
 */
router.get("/:id", getBatch);

/**
 * @route   POST /api/v1/batch/createBatch
 * @desc    Create a new batch
 * @access  Private (for testing, this may be public)
 */
router.post("/createBatch", createBatch);

/**
 * @route   PUT /api/v1/batch/:id
 * @desc    Update a batch by ID
 * @access  Private (requires authentication in production)
 */
router.put("/:id", protect, updateBatch);

/**
 * @route   DELETE /api/v1/batch/:id
 * @desc    Delete a batch by ID
 * @access  Private (requires authentication in production)
 */
router.delete("/:id", protect, deleteBatch);

module.exports = router;
