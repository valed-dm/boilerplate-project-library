/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function() {
  suite("Routing tests", function() {
    let id1;
    let id2 = "000000000000000000000000";
    suite(
      "POST /api/books with title => create book object/expect book object",
      function() {
        //#1
        test("Test POST /api/books with title", function(done) {
          chai
            .request(server)
            .post("/api/books")
            .send({ title: "Uncle's Tom Cabin" })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.type, "application/json");
              assert.isObject(res.body, "response should be an object");
              assert.equal(res.body.title, "Uncle's Tom Cabin");
              assert.property(res.body, "_id");
              assert.property(res.body, "comments");
              id1 = res.body._id;
              done();
            });
        });
        //#2
        test("Test POST /api/books with no title given", function(done) {
          chai
            .request(server)
            .post("/api/books")
            .send({})
            .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body, "missing required field title");
              done();
            });
        });
      }
    );

    suite("GET /api/books => array of books", function() {
      //#3
      test("Test GET /api/books", function(done) {
        chai
          .request(server)
          .get("/api/books")
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body, "response should be an array");
            assert.property(
              res.body[0],
              "commentcount",
              "Books in array should contain commentcount"
            );
            assert.property(
              res.body[0],
              "title",
              "Books in array should contain title"
            );
            assert.property(
              res.body[0],
              "_id",
              "Books in array should contain _id"
            );
          });
        done();
      });
    });

    suite("GET /api/books/[id] => book object with [id]", function() {
      //#4
      test("Test GET /api/books/[id] with id not in db", function(done) {
        chai
          .request(server)
          .get("/api/books/" + id2)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body, "no book exists");
            done();
          });
      });
      //#5
      test("Test GET /api/books/[id] with valid id in db", function(done) {
        chai
          .request(server)
          .get("/api/books/" + id1)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.isObject(res.body, "response should be an object");
            assert.equal(res.body.title, "Uncle's Tom Cabin");
            assert.property(res.body, "_id");
            assert.property(res.body, "comments");
            done();
          });
      });
    });
    suite(
      "POST /api/books/[id] => add comment/expect book object with id",
      function() {
        //#6
        test("Test POST /api/books/[id] with comment", function(done) {
          chai
            .request(server)
            .post("/api/books/" + id1)
            .send({
              comment: "Author: Harriet Beecher Stowe"
            })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.type, "application/json");
              assert.equal(res.body.title, "Uncle's Tom Cabin");
              assert.equal(res.body._id, id1);
              assert.equal(
                res.body.comments[0],
                "Author: Harriet Beecher Stowe"
              );
              done();
            });
        });
        //#7
        test("Test POST /api/books/[id] without comment field", function(done) {
          chai
            .request(server)
            .post("/api/books/" + id1)
            .send({
              comment: ""
            })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.type, "application/json");
              assert.equal(res.body, "missing required field comment");
              done();
            });
        });
        //#8
        test("Test POST /api/books/[id] with comment, id not in db", function(done) {
          chai
            .request(server)
            .post("/api/books/" + id2)
            .send({
              comment: "It's fabulous!"
            })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.type, "application/json");
              assert.equal(res.body, "no book exists");
              done();
            });
        });
      }
    );

    suite("DELETE /api/books/[id] => delete book object id", function() {
      //#9
      test("Test DELETE /api/books/[id] with valid id in db", function(done) {
        chai
          .request(server)
          .delete("/api/books/" + id1)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.equal(res.body, "delete successful");
            done();
          });
      });
      //#10
      test("Test DELETE /api/books/[id] with id not in db", function(done) {
        chai
          .request(server)
          .delete("/api/books/" + id1)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.equal(res.body, "no book exists");
            done();
          });
      });
    });
  });
});
