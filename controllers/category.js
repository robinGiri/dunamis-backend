const asyncHandler = require("../middleware/async");
const Category = require("../models/category");

/**
 * @desc    Get all categories
 * @route   GET /api/v1/category
 * @access  Public
 */
exports.getCategories = asyncHandler(async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * @desc    Get a single category by ID
 * @route   GET /api/v1/category/:id
 * @access  Public
 */
exports.getCategory = asyncHandler(async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res
        .status(404)
        .json({ message: `Category not found with id of ${req.params.id}` });
    }
    res.status(200).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
});

/**
 * @desc    Create a new category
 * @route   POST /api/v1/category
 * @access  Private (or Public as needed)
 *
 * Expected request body:
 * {
 *   "name": "Fiction",
 *   "description": "Books that contain fictional stories"
 * }
 */
exports.createCategory = asyncHandler(async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * @desc    Update a category by ID
 * @route   PUT /api/v1/category/:id
 * @access  Private (or Public as needed)
 */
exports.updateCategory = asyncHandler(async (req, res, next) => {
  try {
    let category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: `Category not found with id of ${req.params.id}` });
    }
    category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
});

/**
 * @desc    Delete a category by ID
 * @route   DELETE /api/v1/category/:id
 * @access  Private (or Public as needed)
 */
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: `Category not found with id of ${req.params.id}` });
    }
    res.status(200).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
});
