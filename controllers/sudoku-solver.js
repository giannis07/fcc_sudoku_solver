
class SudokuSolver {
  // checking if puzzle string has length 81 chars in [1-9\.]
  validate(puzzleString) {
    return puzzleString.length === 81 && /^[1-9\.]*$/.test(puzzleString);
  }

  // checking if value is not in a row
  checkRowPlacement(puzzleString, row, column, value) {
    const start = row * 9;
    for (let i = 0; i < 9; i++) {
      if (puzzleString[start + i] === value) {
        return false;
      }
    }
    return true;
  }

  // checking if value is not in a col
  checkColPlacement(puzzleString, row, column, value) {
    for (let i = 0; i < 9; i++) {
      if (puzzleString[column + i * 9] === value) {
        return false;
      }
    }
    return true;
  }

  // checking if value is not in a region 3x3
  checkRegionPlacement(puzzleString, row, column, value) {
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(column / 3) * 3;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (puzzleString[(startRow + r) * 9 + (startCol + c)] === value) {
          return false;
        }
      }
    }
    return true;
  }

  // checking for valid placement and return result in json
  checkPlacement(puzzleString, coordinate, value) {
    const rowLetter = coordinate[0];
    const colNumber = parseInt(coordinate[1], 10);

    const row = rowLetter.charCodeAt(0) - 'A'.charCodeAt(0);
    const col = colNumber - 1;

    // Έλεγχος εγκυρότητας συντεταγμένων
    if (row < 0 || row > 8 || col < 0 || col > 8) {
      return { valid: false, conflict: ['Invalid coordinate'] };
    }

    const rowConflict = !this.checkRowPlacement(puzzleString, row, col, value.toString());
    const colConflict = !this.checkColPlacement(puzzleString, row, col, value.toString());
    const regionConflict = !this.checkRegionPlacement(puzzleString, row, col, value.toString());

    let valid = true;
    let conflict = [];

    if (rowConflict) conflict.push('row');
    if (colConflict) conflict.push('column');
    if (regionConflict) conflict.push('region');

    if (conflict.length > 0) {
      valid = false;
    }

    // value is there and there is no conflict
    if (puzzleString[row * 9 + col] === value.toString()) {
      valid = true;
      conflict = [];
    }

    return { valid, conflict };
  }

  //solving Sudoku
  solve(puzzleString) {
    let board = puzzleString.split('');

    const solveHelper = (index) => {
      if (index === 81) {
        return true; //all cells are filled right
      }

      if (board[index] !== '.') {
        return solveHelper(index + 1); //move to the next cell
      }

      for (let num = 1; num <= 9; num++) {
        const value = num.toString();
        const row = Math.floor(index / 9);
        const col = index % 9;

        if (
          this.checkRowPlacement(board.join(''), row, col, value) &&
          this.checkColPlacement(board.join(''), row, col, value) &&
          this.checkRegionPlacement(board.join(''), row, col, value)
        ) {
          board[index] = value;

          if (solveHelper(index + 1)) {
            return true; // sudoku solved
          }

          board[index] = '.'; // failed with that value and reset in that cell tests with other value
        }
      }

      return false;  
    };
    // let ar=puzzleString.split("");
    // console.log(ar[0*9+2]);
    return solveHelper(0) ? board.join('') : false;
  }
}

module.exports = SudokuSolver;