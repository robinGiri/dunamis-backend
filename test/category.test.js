const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const server = require("../server"); // Ensure your server.js exports your Express app
const Category = require("../models/category");

chai.use(chaiHttp);

describe("Category API Tests", function () {
  // Clear categories before tests
  before(async function () {
    await Category.deleteMany({});
  });

  let createdCategoryId = null;
  const testCategory = {
    name: "Fiction" + Date.now(), // Unique name to avoid duplicate errors
    description: "Books that contain fictional stories",
  };

  // Test: Create a new category
  it("should create a new category", function (done) {
    chai
      .request(server)
      .post("/api/v1/category")
      .send(testCategory)
      .end(function (err, res) {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an("object");
        expect(res.body.success).to.be.true;
        expect(res.body.data).to.have.property("name").that.includes("Fiction");
        createdCategoryId = res.body.data._id;
        done();
      });
  });

  // Test: Get all categories
  it("should get all categories", function (done) {
    chai
      .request(server)
      .get("/api/v1/category")
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body.data).to.be.an("array");
        // Expect at least one category
        expect(res.body.data.length).to.be.at.least(1);
        done();
      });
  });

  // Test: Get a single category by ID
  it("should get a category by id", function (done) {
    chai
      .request(server)
      .get(`/api/v1/category/${createdCategoryId}`)
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body.success).to.be.true;
        expect(res.body.data).to.have.property("_id", createdCategoryId);
        done();
      });
  });

  // Test: Update a category
  it("should update a category", function (done) {
    const updateData = {
      name: "Updated " + testCategory.name,
      description: "Updated description",
    };
    chai
      .request(server)
      .put(`/api/v1/category/${createdCategoryId}`)
      .send(updateData)
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body.success).to.be.true;
        expect(res.body.data).to.have.property("name", updateData.name);
        done();
      });
  });

  // Test: Delete a category
  it("should delete a category", function (done) {
    chai
      .request(server)
      .delete(`/api/v1/category/${createdCategoryId}`)
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body.success).to.be.true;
        done();
      });
  });
});
