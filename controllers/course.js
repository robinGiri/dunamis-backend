const asyncHandler = require("../middleware/async");
const Course = require("../models/course");

/**
 * @desc    Get all courses
 * @route   GET /api/v1/course/getAllCourse
 * @access  Public
 */
exports.getCourses = asyncHandler(async (req, res, next) => {
  try {
    const courses = await Course.find();
    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * @desc    Get a single course by ID
 * @route   GET /api/v1/course/:id
 * @access  Public
 */
exports.getCourse = asyncHandler(async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: `Course not found with id of ${req.params.id}` });
    }
    res.status(200).json({ success: true, data: course });
  } catch (err) {
    next(err);
  }
});

/**
 * @desc    Create a new course
 * @route   POST /api/v1/course/createCourse
 * @access  Private (or Public for testing)
 *
 * Expected request body:
 * {
 *   "courseName": "Math 101",
 *   "description": "An introductory math course",
 *   "price": 49.99,
 *   "type": "premium",         // or "free"
 *   "author": "John Doe",      // optional
 *   "category": "Science",     // optional
 *   "img": "http://example.com/image.jpg" // optional
 * }
 */
exports.createCourse = asyncHandler(async (req, res, next) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({
      success: true,
      data: course,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * @desc    Update course
 * @route   PUT /api/v1/course/:id
 * @access  Private
 */
exports.updateCourse = asyncHandler(async (req, res, next) => {
  try {
    let course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: `Course not found with id of ${req.params.id}` });
    }
    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, data: course });
  } catch (err) {
    next(err);
  }
});

/**
 * @desc    Delete course
 * @route   DELETE /api/v1/course/:id
 * @access  Private
 */
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: `Course not found with id of ${req.params.id}` });
    }
    res.status(200).json({ success: true, data: course });
  } catch (err) {
    next(err);
  }
});
