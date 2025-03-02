const express = require("express");
const router = express.Router();

// Import category controller functions
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category");

/**
 * @route   GET /api/v1/category
 * @desc    Get all categories
 * @access  Public
 */
router.get("/", getCategories);

/**
 * @route   GET /api/v1/category/:id
 * @desc    Get a single category by ID
 * @access  Public
 */
router.get("/:id", getCategory);

/**
 * @route   POST /api/v1/category
 * @desc    Create a new category
 * @access  Private (or Public for testing)
 */
router.post("/", createCategory);

/**
 * @route   PUT /api/v1/category/:id
 * @desc    Update a category by ID
 * @access  Private (or Public for testing)
 */
router.put("/:id", updateCategory);

/**
 * @route   DELETE /api/v1/category/:id
 * @desc    Delete a category by ID
 * @access  Private (or Public for testing)
 */
router.delete("/:id", deleteCategory);

module.exports = router;
