const express = require("express");
const router = express.Router();

// Import middleware for route protection and file uploads
const { protect } = require("../middleware/auth");
const upload = require("../middleware/uploads");

// Import controller functions for student operations
const {
  getStudents,
  getStudent,
  register,
  login,
  searchByBatch,
  searchByCourse,
  updateStudent,
  deleteStudent,
  uploadImage,
  getMe,
} = require("../controllers/student");

// Route to upload a student image (if required)
router.post("/uploadImage", upload, uploadImage);

// Student registration route
// Full endpoint: POST /api/v1/auth/register
router.post("/register", register);

// Student login route
// Full endpoint: POST /api/v1/auth/login
router.post("/login", login);

// Get all students route (if needed; not used in our workflow tests)
// Full endpoint: GET /api/v1/auth/getAllStudents
router.get("/getAllStudents", protect, getStudents);

// Search students by batch or course (if needed)
// Full endpoints: GET /api/v1/auth/getStudentsByBatch/:batchId
//                 GET /api/v1/auth/getStudentsByCourse/:courseId
router.get("/getStudentsByBatch/:batchId", protect, searchByBatch);
router.get("/getStudentsByCourse/:courseId", protect, searchByCourse);

// Update student route
// Full endpoint: PUT /api/v1/auth/updateStudent/:id
router.put("/updateStudent/:id", protect, updateStudent);

// Delete student route
// Full endpoint: DELETE /api/v1/auth/deleteStudent/:id
router.delete("/deleteStudent/:id", protect, deleteStudent);

// Get current logged-in student route
// Full endpoint: GET /api/v1/auth/getMe
router.get("/getMe", protect, getMe);

module.exports = router;
