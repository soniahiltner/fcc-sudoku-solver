const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);
let validPuzzle =
  "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3";
suite("Functional Tests", () => {
  suite("Solve test", () => {
    test("Solve a puzzle with valid puzzle string: POST request to /api/solve", function (done) {
      let solution =
        "568913724342687519197254386685479231219538467734162895926345178473891652851726943";
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: validPuzzle })
        .end((req, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.solution, solution);
          done();
        });
    });
    test(
      "Solve a puzzle with missing puzzle string: POST request to /api/solve", function (done) {
        chai
          .request(server)
          .post("/api/solve")
          .send({ puzzle: "" })
          .end((req, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.body.error, "Required field missing");
            done();
        })
      }
    );

    test("Solve a puzzle with invalid characters: POST request to /api/solve", function (done) {
      chai.request(server).post("/api/solve").send({
        puzzle:
          "x..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3",
      })
        .end((req, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.body.error, "Invalid characters in puzzle");
          done();
      })
    });

    test("Solve a puzzle with incorrect length: POST request to /api/solve", function (done) {
      chai
        .request(server)
        .post("/api/solve")
        .send({
          puzzle:
            "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...344",
        })
        .end((req, res) => {
          assert.equal(res.status, 200)
          assert.equal(
            res.body.error,
            "Expected puzzle to be 81 characters long"
          );
          done();
      })
    });

    test("Solve a puzzle that cannot be solved: POST request to /api/solve", function (done) {
      chai
        .request(server)
        .post("/api/solve")
        .send({
          puzzle:
            "..9..5.1.85.4....24322.....1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
        })
        .end((req, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Puzzle cannot be solved");
        });
      done();
    });
  });

  suite("Check test", () => {
    test(
      "Check a puzzle placement with all fields: POST request to /api/check", function (done) {
        chai.request(server).post("/api/check").send({
          puzzle:
            "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3",
          coordinate: "a1",
          value: "5"
        })
          .end((req, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.body.valid, true)
          })
        done();
      }
    );

    test(
      "Check a puzzle placement with single placement conflict: POST request to /api/check", function (done) {
        chai.request(server).post("/api/check").send({
          puzzle:
            "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
          coordinate: "a9",
          value: "5"
        })
          .end((req, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.body.valid, false);
            assert.equal(res.body.conflict.length, 1)
            done();
        })
      }
    );

    test(
      "Check a puzzle placement with multiple placement conflicts: POST request to /api/check", function (done) {
        chai.request(server).post("/api/check").send({
          puzzle:
            "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
          coordinate: "a9",
          value: "9"
        })
          .end((req, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.body.valid, false)
            assert.equal(res.body.conflict.length, 2)
            done()
          })
      }
    );

    test(
      "Check a puzzle placement with all placement conflicts: POST request to /api/check", function (done) {
        chai.request(server).post("/api/check").send({
          puzzle:
            "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
          coordinate: "d7",
          value: "6"
        })
          .end((req, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.body.conflict.length, 3)
            done();
        })
      }
    );

    test(
      "Check a puzzle placement with missing required fields: POST request to /api/check", function (done) {
        chai.request(server).post("/api/check").send({
          puzzle: validPuzzle,
          coordinate: "d7",
          value: "",
        })
          .end((req, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.body.error, "Required field(s) missing")
          done()
        })
      }
    );

    test(
      "Check a puzzle placement with invalid characters: POST request to /api/check", function (done) {
        chai.request(server).post("/api/check").send({
          puzzle:
            "..9..5.1.85.4....2432......1.p.69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
          coordinate: "a1",
          value: "7",
        })
          .end((req, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.body.error, "Invalid characters in puzzle")
            done();
        })
      }
    );

    test(
      "Check a puzzle placement with incorrect length: POST request to /api/check", function (done) {
        chai.request(server).post("/api/check").send({
          puzzle:
            "..9..5.1.85.4....2432......1.p.69.83.9.....6.62.71...9......1945....4.37.4.3..6..8",
          coordinate: "a1",
          value: "7",
        })
          .end((req, res) => {
            assert.equal(res.status, 200)
            assert.equal(
              res.body.error,
              "Expected puzzle to be 81 characters long"
            );
            done();
        })
      }
    );

    test("Check a puzzle placement with invalid placement coordinate: POST request to /api/check", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle:validPuzzle,
          coordinate: "a0",
          value: "7",
        })
        .end((req, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid coordinate");
          done();
        });
    });

    test("Check a puzzle placement with invalid placement value: POST request to /api/check", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: validPuzzle,
          coordinate: "a1",
          value: "10",
        })
        .end((req, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid value");
          done();
        });
    });

  })
});
