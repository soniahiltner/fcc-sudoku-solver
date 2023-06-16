const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
let solver = new Solver();

suite("Unit Tests", () => {
  suite("Input validation", () => {
    test("Logic handles a valid puzzle string of 81 characters", function (done) {
      let puzzleString =
        "135762984946381257728459613694517832812936745357824196473298561581673429269145378";
      assert.equal(solver.validate(puzzleString), "Valid puzzle");
      done();
    });

    test(
      "Logic handles a puzzle string with invalid characters (not 1-9 or .)", function (done) {
        let puzzleString =
          "13576298494638125772845961369451783281293674535782419647329856158167342926914537a";
        assert.equal(solver.validate(puzzleString), "Invalid characters");
        done()
      }
    );

    test("Logic handles a puzzle string that is not 81 characters in length", function (done) {
      let puzzleString =
        "13576298494638125772845961369451783281293674535782419647329856158167342926914537";
      assert.equal(solver.validate(puzzleString), "Invalid length");
      done()
    });

    test("Logic handles a valid row placement", function (done) {
      let puzzleString =
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
      let row = 0;
      let value = 3;
      assert.equal(solver.checkRowPlacement(puzzleString, row, value), true);
      done()
      
    });

    test("Logic handles an invalid row placement", function (done) {
      let puzzleString =
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
      let row = 0;
      let value = 8;
      assert.equal(solver.checkRowPlacement(puzzleString, row, value), false);
      done();
    });

    test("Logic handles a valid column placement", function (done) {
      let puzzleString =
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
      let col = 1;
      let value = 8;
      assert.equal(solver.checkColPlacement(puzzleString, col, value), true);
      done();
    });

    test("Logic handles an invalid column placement", function (done) {
      let puzzleString =
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
      let col = 1;
      let value = 9;
      assert.equal(solver.checkColPlacement(puzzleString, col, value), false);
      done();
    });

    test("Logic handles a valid region (3x3 grid) placement", function (done) {
      let puzzleString =
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
      let row = 0;
      let col = 4;
      let value = 9;
      assert.equal(
        solver.checkRegionPlacement(puzzleString, row, col, value),
        true
      );
      done();
    });

    test("Logic handles an invalid region (3x3 grid) placement", function (done) {
      let puzzleString =
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
      let row = 2;
      let col = 0;
      let value = 6;
      assert.equal(
        solver.checkRegionPlacement(puzzleString, row, col, value),
        false
      );
      done();
    });
    
  });

  suite('Test the solver', () => {
    test("Valid puzzle strings pass the solver", function (done) {
      let puzzleString =
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
      assert.equal(
        solver.solve(puzzleString),
        "135762984946381257728459613694517832812936745357824196473298561581673429269145378"
      );
      done();
    });

    test("Invalid puzzle strings fail the solver", function (done) {
      let puzzleString =
        "1.5322.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
      assert.equal(
        solver.solve(puzzleString),
        false
      );
      done();
    });

    test("Solver returns the expected solution for an incomplete puzzle", function (done) {
      let puzzleString =
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
      assert.equal(
        solver.solve(puzzleString),
        "135762984946381257728459613694517832812936745357824196473298561581673429269145378"
      );
      done();
    });
  })
});
