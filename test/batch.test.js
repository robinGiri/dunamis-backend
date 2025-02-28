const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const server = require('../server'); // Ensure your server.js exports your Express app
const Batch = require('../models/batch'); // To clear the collection before tests

chai.use(chaiHttp);

/**
 * Batch API Tests
 *
 * Endpoints used:
 * - POST   /api/v1/batch/createBatch  => Create a new batch
 * - GET    /api/v1/batch/getAllBatches  => Get all batches
 * - GET    /api/v1/batch/:id            => Get a single batch by ID
 *
 * Tests:
 * - Test 1: Successfully create a batch with valid input (expect 201)
 * - Test 2: Fail to create a batch with invalid input (expect 400)
 * - Test 3: Retrieve all batches (expect 200)
 * - Test 4: Retrieve a single batch by ID (expect 200)
 */
describe('Batch API Tests', () => {
  let createdBatchId; // To store the ID of the batch created in Test 1

  // Clear the Batch collection before tests run
  before(async function () {
    await Batch.deleteMany({});
  });

  // Test 1: Successfully create a batch with valid input
  it('should create a batch successfully', (done) => {
    // Generate a unique batch name (using hyphen to avoid any space issues)
    const uniqueBatchName = "BatchA-" + Date.now();
    const batch = {
      batchName: uniqueBatchName
    };

    chai.request(server)
      .post('/api/v1/batch/createBatch')
      .send(batch)
      .end((err, res) => {
        console.log("Test 1 response:", res.body); // Debug log
        expect(res.status).to.equal(201);
        expect(res.body).to.be.an('object');
        expect(res.body.success).to.equal(true);
        expect(res.body.data).to.have.property('batchName', batch.batchName);
        // Save the created batch ID for later tests
        createdBatchId = res.body.data._id;
        done();
      });
  });

  // Test 2: Fail to create a batch with invalid input (missing batchName)
  it('should fail to create a batch with invalid input', (done) => {
    const invalidBatch = {}; // Missing required batchName

    chai.request(server)
      .post('/api/v1/batch/createBatch')
      .send(invalidBatch)
      .end((err, res) => {
        console.log("Test 2 response:", res.body); // Debug log
        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.exist;
        done();
      });
  });

  // Test 3: Retrieve all batches
  it('should get all batches', (done) => {
    chai.request(server)
      .get('/api/v1/batch/getAllBatches')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.data).to.be.an('array');
        done();
      });
  });

  // Test 4: Retrieve a single batch by ID
  it('should get a batch by id', (done) => {
    chai.request(server)
      .get('/api/v1/batch/' + createdBatchId)
      .end((err, res) => {
        console.log("Test 4 response:", res.body); // Debug log
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.success).to.equal(true);
        expect(res.body.data).to.have.property('batchName');
        done();
      });
  });
});
