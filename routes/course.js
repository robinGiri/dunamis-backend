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
 * @access  Private (or Public for testing)
 */
router.post("/createCourse", createCourse);

/**
 * @route   PUT /api/v1/course/:id
 * @desc    Update a course by ID
 * @access  Private (requires authentication)
 */
router.put("/:id", /* protect, */ updateCourse);

/**
 * @route   DELETE /api/v1/course/:id
 * @desc    Delete a course by ID
 * @access  Private (requires authentication)
 */
router.delete("/:id", /* protect, */ deleteCourse);

module.exports = router;
