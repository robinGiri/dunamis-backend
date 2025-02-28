const asyncHandler = require("../middleware/async");
const Batch = require("../models/batch");

/**
 * @desc    Get all batches
 * @route   GET /api/v1/batch/getAllBatches
 * @access  Public
 */
exports.getBatches = asyncHandler(async (req, res, next) => {
  try {
    const batches = await Batch.find({});
    res.status(200).json({
      success: true,
      count: batches.length,
      data: batches,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * @desc    Get a single batch by ID
 * @route   GET /api/v1/batch/:id
 * @access  Public
 */
exports.getBatch = asyncHandler(async (req, res, next) => {
  try {
    const batch = await Batch.findById(req.params.id);
    if (!batch) {
      return res
        .status(404)
        .json({ message: `Batch not found with id of ${req.params.id}` });
    }
    res.status(200).json({ success: true, data: batch });
  } catch (err) {
    next(err);
  }
});

/**
 * @desc    Create a new batch
 * @route   POST /api/v1/batch/createBatch
 * @access  Private (for testing, this may be public)
 *
 * Expected request body:
 * {
 *   "batchName": "Batch A"
 * }
 */
exports.createBatch = asyncHandler(async (req, res, next) => {
  try {
    // Create a new Batch document using the request body data
    const batch = await Batch.create(req.body);
    res.status(201).json({
      success: true,
      data: batch,
    });
  } catch (err) {
    // Return 400 if validation fails or an error occurs
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * @desc    Update a batch by ID
 * @route   PUT /api/v1/batch/:id
 * @access  Private
 */
exports.updateBatch = asyncHandler(async (req, res, next) => {
  let batch = await Batch.findById(req.params.id);
  if (!batch) {
    return res
      .status(404)
      .json({ message: `Batch not found with id of ${req.params.id}` });
  }
  batch = await Batch.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    data: batch,
  });
});

/**
 * @desc    Delete a batch by ID
 * @route   DELETE /api/v1/batch/:id
 * @access  Private
 */
exports.deleteBatch = asyncHandler(async (req, res, next) => {
  await Batch.findByIdAndDelete(req.params.id).then((batch) => {
    if (!batch) {
      return res
        .status(404)
        .json({ message: `Batch not found with id of ${req.params.id}` });
    }
    res.status(200).json({ success: true, data: batch });
  });
});
