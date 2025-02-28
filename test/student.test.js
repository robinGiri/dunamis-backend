const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const server = require('../server'); // Ensure your server.js exports your Express app

chai.use(chaiHttp);

describe('Student Workflow Tests', () => {
  /**
   * Test: Register and Login a Student.
   *
   * Endpoints used:
   * - POST   /api/v1/auth/register   => Register a new student
   * - POST   /api/v1/auth/login      => Login the student and receive a token
  */
  it('should register and login a student', (done) => {
    // Generate a unique username to avoid duplicate conflicts
    const uniqueUsername = "teststudent" + Date.now();

    // 1) Register a new student
    const student = {
      username: uniqueUsername,
      password: "Test1234!",
      name: "Test Student",
      email: "teststudent@example.com"
    };

    chai.request(server)
      .post('/api/v1/auth/register')
      .send(student)
      .end((err, res) => {
        // Assert that registration returns 200 OK with the expected message
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.equal("Student created successfully");

        // 2) Login the student to get an auth token
        chai.request(server)
          .post('/api/v1/auth/login')
          .send({
            username: student.username,
            password: student.password
          })
          .end((err, res) => {
            // Assert that login returns 200 OK and a token exists
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body.token).to.exist;
            done();
          });
      });
  });


  /**
   * Test: Attempt to register a student with invalid input.
   * Expected: A 400 error response.
   */
  it('should fail to register a student with invalid input', (done) => {
    // Use an invalid password (too short)
    const invalidStudent = {
      username: "invalidstudent",
      password: "123", // Invalid: too short
      name: "Invalid Student",
      email: "invalidstudent@example.com"
    };

    chai.request(server)
      .post('/api/v1/auth/register')
      .send(invalidStudent)
      .end((err, res) => {
        // Expect a 400 error (adjust if your app returns a different code)
        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.exist;
        done();
      });
  });
});
