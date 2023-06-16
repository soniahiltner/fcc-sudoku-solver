"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    const { puzzle, coordinate, value } = req.body;

    if (!puzzle || !coordinate || !value) {
      return res.json({ error: "Required field(s) missing" });
    }
    if (puzzle.length != 81) {
      res.json({ error: "Expected puzzle to be 81 characters long" });
      return;
    }
    if (solver.invalidPuzzle(puzzle)) {
      res.json({ error: "Invalid characters in puzzle" });
      return;
    }
    if (!/^[1-9]$/.test(value)) {
      res.json({ error: "Invalid value" });
      return;
    }
    if (!/^[a-i][1-9]$/i.test(coordinate)) {
      res.json({ error: "Invalid coordinate" });
      return;
    }
    const row = coordinate.split("")[0];
    const col = coordinate.split("")[1];

    const rowIndex = solver.convertRow(row);
    const colIndex = solver.convertCol(col);
    let notInRow = solver.checkRowPlacement(puzzle, rowIndex, value);
    let notInColumn = solver.checkColPlacement(puzzle, colIndex, value);
    let notInRegion = solver.checkRegionPlacement(
      puzzle,
      rowIndex,
      colIndex,
      value
    );
    let conflict = [];

    if (solver.valueInPlace(puzzle, rowIndex, colIndex, value)) {
      res.json({ valid: true });
      return;
    } else {
      if (!notInRow) {
        conflict.push("row");
      }
      if (!notInColumn) {
        conflict.push("column");
      }
      if (!notInRegion) {
        conflict.push("region");
      }
      if (!notInRow || !notInColumn || !notInRegion) {
        res.json({
          valid: false,
          conflict: conflict,
        });
        return;
      }
      if (notInRow && notInColumn && notInRegion) {
        res.json({ valid: true });
        return;
      }
    }
  });

  ///////////  SOLVE  ///////////
  app.route("/api/solve").post((req, res) => {
    const { puzzle } = req.body;

    if (!puzzle) {
      res.json({ error: "Required field missing" });
      return;
    }
    if (/[^1-9\.]/g.test(puzzle)) {
      res.json({ error: "Invalid characters in puzzle" });
      return;
    }

    if (puzzle.length !== 81) {
      res.json({ error: "Expected puzzle to be 81 characters long" });
      return;
    }
    let solution = solver.solve(puzzle);
    if (!solution) {
      res.json({ error: "Puzzle cannot be solved" });
    } else {
      res.json({ solution: solution });
    }
  });
};
