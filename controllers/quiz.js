const asyncHandler = require("../middleware/async");
const Question = require("../models/question");

/**
 * @desc    Get 20 random quiz questions (for quiz takers).
 *          If a category query parameter is provided, only questions from that category are returned.
 *          The correctAnswer is removed from the returned questions.
 * @route   GET /api/v1/quiz/questions
 * @access  Public
 */
exports.getQuestions = asyncHandler(async (req, res, next) => {
  const { category } = req.query;
  let pipeline = [];
  if (category) {
    pipeline.push({ $match: { category } });
  }
  pipeline.push({ $sample: { size: 20 } });
  const questions = await Question.aggregate(pipeline);
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
 */
exports.submitQuiz = asyncHandler(async (req, res, next) => {
  const submissions = req.body;
  if (!Array.isArray(submissions) || submissions.length === 0) {
    return res.status(400).json({ success: false, message: "No submissions provided" });
  }
  let score = 0;
  await Promise.all(
    submissions.map(async (submission) => {
      try {
        const question = await Question.findById(submission.questionId);
        if (question && question.correctAnswer === submission.answer) {
          score += 1;
        }
      } catch (err) {
        console.error(`Error processing question ${submission.questionId}: `, err);
      }
    })
  );
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
 * @access  Private (or Public as needed)
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
 * @access  Private (or Public as needed)
 */
exports.updateQuestion = asyncHandler(async (req, res, next) => {
  // Retrieve the question document first
  let question = await Question.findById(req.params.id);
  if (!question) {
    return res.status(404).json({ message: `Question not found with id of ${req.params.id}` });
  }
  // Update fields manually
  question.questionText = req.body.questionText;
  question.options = req.body.options;
  question.correctAnswer = req.body.correctAnswer;
  question.category = req.body.category;
  // Save document to trigger pre('save') hook for validation
  question = await question.save();
  res.status(200).json({ success: true, data: question });
});
