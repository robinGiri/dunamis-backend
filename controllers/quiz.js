const asyncHandler = require("../middleware/async");
const Question = require("../models/question");

/**
 * @desc    Get 20 random questions for a quiz
 * @route   GET /api/v1/quiz/questions
 * @access  Public
 */
exports.getQuestions = asyncHandler(async (req, res, next) => {
  // Use MongoDB aggregate with $sample to select 20 random questions
  const questions = await Question.aggregate([{ $sample: { size: 20 } }]);

  // Remove correctAnswer from the returned questions for security
  const sanitizedQuestions = questions.map((q) => ({
    _id: q._id,
    questionText: q.questionText,
    options: q.options,
  }));

  res.status(200).json({
    success: true,
    count: sanitizedQuestions.length,
    data: sanitizedQuestions,
  });
});

/**
 * @desc    Submit quiz answers and return the score
 * @route   POST /api/v1/quiz/submit
 * @access  Public
 *
 * Expected request body:
 * [
 *   { questionId: "<id>", answer: "student answer" },
 *   ...
 * ]
 */
exports.submitQuiz = asyncHandler(async (req, res, next) => {
  const submissions = req.body; // Expecting an array of submissions

  if (!Array.isArray(submissions) || submissions.length === 0) {
    return res.status(400).json({ success: false, message: "No submissions provided" });
  }

  let score = 0;

  for (const submission of submissions) {
    const question = await Question.findById(submission.questionId);
    if (question && question.correctAnswer === submission.answer) {
      score += 1;
    }
  }

  res.status(200).json({
    success: true,
    totalQuestions: submissions.length,
    score,
    mark: `${score} out of ${submissions.length}`,
  });
});

/**
 * @desc    Add a new quiz question
 * @route   POST /api/v1/quiz/question
 * @access  Private (or Public, as per your needs)
 *
 * Expected request body:
 * {
 *   "questionText": "What is 2 + 2?",
 *   "options": ["3", "4", "5", "6"],
 *   "correctAnswer": "4"
 * }
 */
exports.addQuestion = asyncHandler(async (req, res, next) => {
  const question = await Question.create(req.body);
  res.status(201).json({
    success: true,
    data: question,
  });
});

/**
 * @desc    Update an existing quiz question
 * @route   PUT /api/v1/quiz/question/:id
 * @access  Private (or Public, as per your needs)
 */
exports.updateQuestion = asyncHandler(async (req, res, next) => {
  let question = await Question.findById(req.params.id);
  if (!question) {
    return res.status(404).json({ message: `Question not found with id of ${req.params.id}` });
  }
  question = await Question.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: question });
});
