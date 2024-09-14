const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver=new Solver();;



let validTest = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';

let expectedSolution='135762984946381257728459613694517832812936745357824196473298561581673429269145378'
suite('Unit Tests', () => {
    test("Logic handles a valid puzzle string of 81 characters",(done)=>{
        let result="135762984946381257728459613694517832812936745357824196473298561581673429269145378";
        assert.equal(solver.solve(validTest),result);
        done();
    })
    test("Logic handles a puzzle string with invalid characters (not 1-9 or .)",(done)=>{
        let invalidTest = "1a5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
        assert.isFalse(solver.validate(invalidTest), "puzzle string with invalid characters");
        done();
    })
    test("Logic handles a puzzle string that is not 81 characters in length",(done)=>{
        let short="135762984946381257728";
        let long="13576298494638125772845961369451783281293674535782419647329856158167342926914537824525";
        assert.isFalse(solver.validate(short), "Puzzle string is too short");
        assert.isFalse(solver.validate(long), "Puzzle string is too long");
        done();
    })
    test("Logic handles a valid row placement",(done)=>{
        let checkrow = solver.checkRowPlacement(validTest, 0, 1, '3'); 
        assert.isTrue(checkrow, 'valid row placement');
        done();
    })
    test("Logic handles an invalid row placement", (done) => {
        let checkRow = solver.checkRowPlacement(validTest, 0, 1, '5');            
        assert.isFalse(checkRow, 'invalid row placement');
        done();
    });
    
    test("Logic handles a valid column placement",(done)=>{
        let checkrow = solver.checkColPlacement(validTest, 1, 0, '9'); 
        assert.isTrue(checkrow, 'valid col placement');
        done();
    })
    test("Logic handles an invalid column placement", (done) => {
        let checkCol = solver.checkColPlacement(validTest, 1, 0, '8');        
        assert.isFalse(checkCol, 'invalid column placement');
        done();
    });
    test("Logic handles a valid region (3x3 grid) placement", (done) => {
        let checkRegion = solver.checkRegionPlacement(validTest, 2, 2, '8');        
        assert.isTrue(checkRegion, 'valid region placement');
        done();
    });
    test("Logic handles a invalid region (3x3 grid) placement", (done) => {
        let checkRegion = solver.checkRegionPlacement(validTest, 2, 2, '5');        
        assert.isFalse(checkRegion, 'invalid region placement');
        done();
    });
    test("Valid puzzle strings pass the solver", (done) => {
        let solvedPuzzle = solver.solve(validTest);
        assert.equal(solvedPuzzle, expectedSolution);
        assert.lengthOf(solvedPuzzle, 81);
        done();
    });
    test("Invalid puzzle strings fail the solver", (done) => {
        let invalidTest = '115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        let solvedPuzzle = solver.solve(invalidTest);
        assert.equal(solvedPuzzle, false);
        done();
    });
    test("Solver returns the expected solution for an incomplete puzzle", (done) => {
        let solvedPuzzle = solver.solve(validTest);
    
        assert.equal(solvedPuzzle, expectedSolution);
        
        done();
    });
    
    
    

});
 