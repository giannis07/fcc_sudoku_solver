

'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;

      // check for Required field(s) missing
      if (!puzzle || !coordinate || value === undefined) {
        return res.json({ error: 'Required field(s) missing' });
      }

      
      // check puzzle.lengt
      if (puzzle.length !== 81) {
        return res.json({ error: 'Expected puzzle to be 81 characters long' });
      }
      
      // check Invalid characters in puzzle
      if (!solver.validate(puzzle)) {
        return res.json({ error: 'Invalid characters in puzzle' });
      }


      // check invalid coordinate
      const rowLetter = coordinate[0];
      const colNumber = parseInt(coordinate[1], 10);

      if (coordinate.length !== 2 || !rowLetter || isNaN(colNumber)) {
        return res.json({ error: 'Invalid coordinate' });
      }

      if (!['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'].includes(rowLetter) || isNaN(colNumber) || colNumber < 1 || colNumber > 9) {
        return res.json({ error: 'Invalid coordinate' });
      }
       

      // check invalid value to fill
      if (!['1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(value.toString())) {
        return res.json({ error: 'Invalid value' });
      }

      // check conflicts
      const { valid, conflict } = solver.checkPlacement(puzzle, coordinate, value);

      if (valid) {
        res.json({ valid });
      } else {
        res.json({ valid, conflict });
      }
    });

  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;

      // check Required field missing
      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      }

      // check puzzle.length and Invalid characters in puzzle
      if (puzzle.length !== 81) {
        return res.json({ error: 'Expected puzzle to be 81 characters long' });
      }

      const validChars = /^[1-9\.]*$/;
      if (!validChars.test(puzzle)) {
        return res.json({ error: 'Invalid characters in puzzle' });
      }

      // solve sudoku
      const solution = solver.solve(puzzle);
      if (solution) {
        res.json({ solution });
      } else {
        res.json({ error: 'Puzzle cannot be solved' });
      }
    });
};
