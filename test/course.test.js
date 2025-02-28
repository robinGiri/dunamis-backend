const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const server = require('../server'); // Ensure your server.js exports your Express app

chai.use(chaiHttp);

/**
 * Course API Tests
 *
 * Endpoints used:
 * - POST   /api/v1/course/createCourse    => Create a new course
 * - GET    /api/v1/course/getAllCourse      => Get all courses
 * - GET    /api/v1/course/:id               => Get a single course by ID
 *
 * Tests:
 * - Test 1: Create a course with valid input (expect 201)
 * - Test 2: Fail to create a course with invalid input (expect 400)
 * - Test 3: Retrieve all courses (expect 200)
 * - Test 4: Retrieve a single course by ID (expect 200)
 */
describe('Course API Tests', () => {
  let createdCourseId; // To store the ID of the created course

  // Test 1: Successfully create a course with unique courseName
  it('should create a course successfully', (done) => {
    // Generate a unique course name to avoid duplicate conflicts
    const uniqueCourseName = "Math 101 " + Date.now();
    const course = {
      courseName: uniqueCourseName,
      description: "An introductory math course",
      price: 49.99,
      type: "premium"
    };

    chai.request(server)
      .post('/api/v1/course/createCourse')
      .send(course)
      .end((err, res) => {
        // Debug: Log error if exists
        if (err) console.error(err);
        // Expect status 201 (Created)
        expect(res.status).to.equal(201);
        expect(res.body).to.be.an('object');
        expect(res.body.success).to.equal(true);
        expect(res.body.data).to.have.property('courseName', course.courseName);
        expect(res.body.data).to.have.property('description', course.description);
        expect(res.body.data).to.have.property('price', course.price);
        expect(res.body.data).to.have.property('type', course.type);
        // Save the created course ID for later tests
        createdCourseId = res.body.data._id;
        done();
      });
  });

  // Test 2: Fail to create a course with invalid input (missing required fields)
  it('should fail to create a course with invalid input', (done) => {
    // Missing description, price, and type
    const invalidCourse = { courseName: "History 101 " + Date.now() };

    chai.request(server)
      .post('/api/v1/course/createCourse')
      .send(invalidCourse)
      .end((err, res) => {
        // Expect status 400 (Bad Request) for invalid input
        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.exist;
        done();
      });
  });

  // Test 3: Retrieve all courses
  it('should get all courses', (done) => {
    chai.request(server)
      .get('/api/v1/course/getAllCourse')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.data).to.be.an('array');
        done();
      });
  });

  // Test 4: Retrieve a single course by ID
  it('should get a course by id', (done) => {
    chai.request(server)
      .get('/api/v1/course/' + createdCourseId)
      .end((err, res) => {
        // Debug: Log error if exists
        if (err) console.error(err);
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.success).to.equal(true);
        // Check that the courseName matches the one created in Test 1
        expect(res.body.data).to.have.property('courseName');
        done();
      });
  });
});
