const express = require("express");
const router = express.Router();
const { getQuestions, submitQuiz, addQuestion, updateQuestion } = require("../controllers/quiz");

/**
 * @route   GET /api/v1/quiz/questions
 * @desc    Get 20 random quiz questions
 * @access  Public
 */
router.get("/questions", getQuestions);

/**
 * @route   POST /api/v1/quiz/submit
 * @desc    Submit quiz answers and get score
 * @access  Public
 */
router.post("/submit", submitQuiz);

/**
 * @route   POST /api/v1/quiz/question
 * @desc    Add a new quiz question
 * @access  Private (or Public, as needed)
 */
router.post("/question", addQuestion);

/**
 * @route   PUT /api/v1/quiz/question/:id
 * @desc    Update an existing quiz question
 * @access  Private (or Public, as needed)
 */
router.put("/question/:id", updateQuestion);

module.exports = router;
