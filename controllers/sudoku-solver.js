class SudokuSolver {
  validate(puzzleString) {
    if (/[^1-9\.]/g.test(puzzleString)) {
      return "Invalid characters";
    } else {
      if (puzzleString.length === 81) {
        return "Valid puzzle";
      } else {
        return "Invalid length";
      }
    }
  }
  invalidPuzzle(puzzleString) {
    if (/[^1-9\.]/g.test(puzzleString)) {
      return true;
    }
    return false;
  }
  validRow(row) {
    return /^[a-i]$/i.test(row);
  }
  validColumn(col) {
    return /^[1-9]$/.test(col);
  }
  validCoordinate(coordinate) {
    const row = coordinate.split("")[0];
    const col = coordinate.split("")[1];
    return this.validRow(row) && this.validColumn(col);
  }
  validValue(value) {
    return /^[1-9]$/.test(value);
  }

  valueInPlace(puzzleString, row, col, value) {
    let grid = this.createBoard(puzzleString);
    if (row !== -1 && col !== -1) {
      if (grid[row][col] == value) {
        return true;
      }
      return false;
    }
    return;
  }

  convertRow(row) {
    const rows = ["a", "b", "c", "d", "e", "f", "g", "h", "i"];
    return rows.indexOf(row?.toLowerCase());
  }

  convertCol(col) {
    const cols = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    return cols.indexOf(col);
  }

  checkRowPlacement(puzzleString, row, value) {
    let grid = this.createBoard(puzzleString);
    if (row !== -1) {
      for (let x = 0; x < 9; x++) {
        if (grid[row][x] == value) return false;
      }
      return true;
    }
    return;
  }

  checkColPlacement(puzzleString, col, value) {
    let grid = this.createBoard(puzzleString);
    if (col !== -1) {
      for (let x = 0; x < 9; x++) {
        if (grid[x][col] == value) return false;
      }
      return true;
    }
    return;
  }

  checkRegionPlacement(puzzleString, row, col, value) {
    let grid = this.createBoard(puzzleString);
    if (row !== -1 && col !== -1) {
      let startRow = row - (row % 3),
        startCol = col - (col % 3);
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (grid[i + startRow][j + startCol] == value) return false;
        }
      }
      return true;
    }
    return;
  }

  twoDimension(arr, size) {
    var res = [];
    for (var i = 0; i < arr.length; i = i + size)
      res.push(arr.slice(i, i + size));
    return res;
  }

  createBoard(puzzleString) {
    let grid = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];

    let row = -1;
    let col = 0;
    for (let i = 0; i < puzzleString.length; i++) {
      if (i % 9 == 0) {
        row++;
      }
      if (col % 9 == 0) {
        col = 0;
      }
      grid[row][col] = puzzleString[i] === "." ? 0 : +puzzleString[i];
      col++;
    }
    return grid;
  }

  backToString(board) {
    return board.flat().join("");
  }

  isSafe(grid, row, col, num) {
    for (let x = 0; x <= 8; x++) if (grid[row][x] == num) return false;

    for (let x = 0; x <= 8; x++) if (grid[x][col] == num) return false;

    let startRow = row - (row % 3),
      startCol = col - (col % 3);

    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++)
        if (grid[i + startRow][j + startCol] == num) return false;

    return true;
  }

  solveSudoku(grid, row, col) {
    let N = 9;
    if (row == N - 1 && col == N) return grid;

    if (col == N) {
      row++;
      col = 0;
    }

    if (grid[row][col] != 0) return this.solveSudoku(grid, row, col + 1);

    for (let num = 1; num < 10; num++) {
      if (this.isSafe(grid, row, col, num)) {
        grid[row][col] = num;
        if (this.solveSudoku(grid, row, col + 1)) return grid;
      }

      grid[row][col] = 0;
    }
    return false;
  }

  solve(puzzleString) {
    let grid = this.createBoard(puzzleString);
    let solved = this.solveSudoku(grid, 0, 0);
    if (!solved) {
      return false;
    }
    let solution = solved.flat().join("");
    return solution;
  }
}

module.exports = SudokuSolver;
