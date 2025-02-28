const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const server = require('../server');
const Question = require('../models/question');

chai.use(chaiHttp);

/**
 * Quiz API Tests
 *
 * Endpoints used:
 * - GET  /api/v1/quiz/questions       => Get 20 random questions
 * - POST /api/v1/quiz/submit          => Submit quiz answers and get score
 * - POST /api/v1/quiz/question        => Add a new quiz question
 * - PUT  /api/v1/quiz/question/:id    => Update an existing quiz question
 */
describe('Quiz API Tests', () => {

  let createdQuestionId;

  // Ensure there are some questions in the DB
  before(async function () {
    await Question.deleteMany({});
    // Insert sample questions if needed
    await Question.insertMany([
      {
        questionText: "What is 2+2?",
        options: ["3", "4", "5", "6"],
        correctAnswer: "4"
      },
      {
        questionText: "What is the capital of France?",
        options: ["Paris", "London", "Berlin", "Rome"],
        correctAnswer: "Paris"
      },
      // ... add more as needed
    ]);
  });

  // Test: Add a new question
  it('should add a new question successfully', (done) => {
    const question = {
      questionText: "What is the color of the sky?",
      options: ["Blue", "Green", "Red", "Yellow"],
      correctAnswer: "Blue"
    };

    chai.request(server)
      .post('/api/v1/quiz/question')
      .send(question)
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body).to.be.an('object');
        expect(res.body.success).to.equal(true);
        expect(res.body.data).to.have.property('questionText', question.questionText);
        createdQuestionId = res.body.data._id;
        done();
      });
  });

  // Test: Update an existing question
  it('should update an existing question', (done) => {
    const updatedData = {
      questionText: "What is the color of a clear sky?",
      options: ["Blue", "Gray", "Red", "Black"],
      correctAnswer: "Blue"
    };

    chai.request(server)
      .put('/api/v1/quiz/question/' + createdQuestionId)
      .send(updatedData)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.success).to.equal(true);
        expect(res.body.data).to.have.property('questionText', updatedData.questionText);
        done();
      });
  });

  // Test: Get 20 random quiz questions
  it('should get 20 random quiz questions', (done) => {
    chai.request(server)
      .get('/api/v1/quiz/questions')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.data).to.be.an('array');
        // If there are fewer than 20 questions, it returns that number
        done();
      });
  });

  // Test: Submit quiz answers and get a score (using 2 sample questions)
  it('should submit quiz answers and return a score', (done) => {
    // Get two questions from DB for testing
    Question.find({}).limit(2).then((questions) => {
      const submissions = questions.map((q, index) => ({
        questionId: q._id,
        answer: index === 0 ? q.correctAnswer : "Wrong Answer"
      }));

      chai.request(server)
        .post('/api/v1/quiz/submit')
        .send(submissions)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('object');
          // One correct answer expected
          expect(res.body.score).to.equal(1);
          done();
        });
    });
  });
});
