const express = require("express");
const router = express.Router();

// Import course controller functions
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/course");

/**
 * @route   GET /api/v1/course/getAllCourse
 * @desc    Get all courses
 * @access  Public
 */
router.get("/getAllCourse", getCourses);

/**
 * @route   GET /api/v1/course/:id
 * @desc    Get a single course by ID
 * @access  Public
 */
router.get("/:id", getCourse);

/**
 * @route   POST /api/v1/course/createCourse
 * @desc    Create a new course
 * @access  Private (for testing, this may be public)
 */
router.post("/createCourse", createCourse);

/**
 * @route   PUT /api/v1/course/:id
 * @desc    Update a course by ID
 * @access  Private (requires authentication in production)
 */
router.put("/:id", /* protect, */ updateCourse);

/**
 * @route   DELETE /api/v1/course/:id
 * @desc    Delete a course by ID
 * @access  Private (requires authentication in production)
 */
router.delete("/:id", /* protect, */ deleteCourse);

module.exports = router;
