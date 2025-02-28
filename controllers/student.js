// controllers/student.js
const asyncHandler = require("../middleware/async");
const Student = require("../models/student");
const Batch = require("../models/batch");
const Course = require("../models/course");
const path = require("path");
const fs = require("fs");

// ----------------------------------------------------------------------
// @desc    Get all students
// @route   GET /api/v1/students (Not currently used; available for admin use)
// @access  Private
// ----------------------------------------------------------------------
exports.getStudents = asyncHandler(async (req, res, next) => {
  const students = await Student.find({});
  res.status(200).json({
    success: true,
    count: students.length,
    data: students,
  });
});

// ----------------------------------------------------------------------
// @desc    Get single student by ID
// @route   GET /api/v1/students/:id
// @access  Private
// ----------------------------------------------------------------------
exports.getStudent = asyncHandler(async (req, res, next) => {
  const student = await Student.findById(req.params.id);
  if (!student) {
    return res
      .status(404)
      .json({ message: `Student not found with id of ${req.params.id}` });
  } else {
    res.status(200).json({
      success: true,
      data: student,
    });
  }
});

// ----------------------------------------------------------------------
// @desc    Register a new student
// @route   POST /api/v1/auth/register
// @access  Public
// ----------------------------------------------------------------------
exports.register = asyncHandler(async (req, res, next) => {
  // Check if a student with the same username already exists
  const studentExists = await Student.findOne({ username: req.body.username });
  if (studentExists) {
    return res.status(400).send({ message: "Student already exists" });
  }

  // Create a new student document using the request body data
  await Student.create(req.body);

  res.status(200).json({
    success: true,
    message: "Student created successfully",
  });
});

// ----------------------------------------------------------------------
// @desc    Login a student
// @route   POST /api/v1/auth/login
// @access  Public
// ----------------------------------------------------------------------
exports.login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  // Validate that both username and password are provided
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Please provide a username and password" });
  }

  // Find the student by username and explicitly select the password field
  const student = await Student.findOne({ username }).select("+password");

  // Check if student exists and if the password matches
  if (!student || !(await student.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Send token response (creates a JWT and sets a cookie)
  sendTokenResponse(student, 200, res);
});

// ----------------------------------------------------------------------
// @desc    Search students by batch
// @route   GET /api/v1/students/search/:batchId
// @access  Private
// ----------------------------------------------------------------------
exports.searchByBatch = asyncHandler(async (req, res, next) => {
  const batchId = req.params.batchId;
  // Find students matching the given batchId, populate batch and course data, and omit sensitive fields
  Student.find({ batch: batchId })
    .populate("batch", "-__v")
    .populate("course", "-__v")
    .select("-password -__v")
    .then((student) => {
      res.status(201).json({
        success: true,
        message: "List of students by batch",
        data: student,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: err,
      });
    });
});

// ----------------------------------------------------------------------
// @desc    Search students by course
// @route   GET /api/v1/students/search/:courseId
// @access  Private
// ----------------------------------------------------------------------
exports.searchByCourse = asyncHandler(async (req, res, next) => {
  const courseId = req.params.courseId;
  // Find students matching the courseId in the courses array
  Student.find({
    course: {
      $elemMatch: {
        $eq: { _id: courseId },
      },
    },
  })
    .select("-password -__v")
    .populate("batch", "-__v")
    .populate("course", "-__v")
    .then((student) => {
      res.status(201).json({
        success: true,
        message: "List of students by course",
        data: student,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: err,
      });
    });
});

// ----------------------------------------------------------------------
// @desc    Update a student's information
// @route   PUT /api/v1/auth/updateStudent/:id
// @access  Private
// ----------------------------------------------------------------------
exports.updateStudent = asyncHandler(async (req, res, next) => {
  const user = req.body;
  const student = await Student.findByIdAndUpdate(req.params.id, user, {
    new: true,
    runValidators: true,
  });

  if (!student) {
    return res.status(404).send({ message: "Student not found" });
  }

  res.status(200).json({
    success: true,
    message: "Student updated successfully",
    data: student,
  });
});

// ----------------------------------------------------------------------
// @desc    Get the current logged-in student's profile
// @route   GET /api/v1/auth/getMe
// @access  Private
// ----------------------------------------------------------------------
exports.getMe = asyncHandler(async (req, res, next) => {
  // req.user is populated by the protect middleware
  const student = await Student.findById(req.user.id).select("-password");
  res.status(200).json(student);
});

// ----------------------------------------------------------------------
// @desc    Delete a student
// @route   DELETE /api/v1/auth/deleteStudent/:id
// @access  Private
// ----------------------------------------------------------------------
exports.deleteStudent = asyncHandler(async (req, res, next) => {
  console.log(req.params.id);
  Student.findByIdAndDelete(req.params.id)
    .then((student) => {
      if (student != null) {
        // Construct the image path if the student has an associated image
        const imagePath = path.join(
          __dirname,
          "..",
          "public",
          "uploads",
          student.image
        );

        // Delete the image file from the file system
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.log(err);
          }
          res.status(200).json({
            success: true,
            message: "Student deleted successfully",
          });
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Student not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    });
});

// ----------------------------------------------------------------------
// @desc    Upload a single image for a student
// @route   POST /api/v1/auth/uploadImage
// @access  Private
// ----------------------------------------------------------------------
exports.uploadImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return res.status(400).send({ message: "Please upload a file" });
  }
  res.status(200).json({
    success: true,
    data: req.file.filename,
  });
});

// ----------------------------------------------------------------------
// Helper function: Create a JWT token, set it as a cookie, and send it in the response
// ----------------------------------------------------------------------
const sendTokenResponse = (student, statusCode, res) => {
  // Generate token using the model's method
  const token = student.getSignedJwtToken();

  // Options for the cookie (expires in 30 days)
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  // If in production (or "proc") mode, set secure cookies
  if (process.env.NODE_ENV === "proc") {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      token,
    });
};
