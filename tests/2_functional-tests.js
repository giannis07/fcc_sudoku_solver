const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let validTest = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';

suite('Functional Tests', () => {

    test("Solve a puzzle with valid puzzle string: POST request to /api/solve", (done) => {
        chai.request(server)
            .post("/api/solve")
            .send({ puzzle: validTest })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                let expectedSolution = "135762984946381257728459613694517832812936745357824196473298561581673429269145378";
                assert.equal(res.body.solution, expectedSolution);
                done();
            });
    });

    test("Solve a puzzle with missing puzzle string: POST request to /api/solve", (done) => {
        chai.request(server)
            .post("/api/solve")
            .send({})  
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { error: 'Required field missing' }, 'Res body should contain error message for missing field');
                done();
            });
    });

    test("Solve a puzzle with invalid characters: POST request to /api/solve", (done) => {
        let invalidPuzzle = "aa..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.3aaa";  
        
        chai.request(server)
            .post("/api/solve")
            .send({ puzzle: invalidPuzzle })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' });
                done();
            });
    });

    test("Solve a puzzle with incorrect length: POST request to /api/solve", (done) => {
        let longPuzzle = "111..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.3111";  
        
        chai.request(server)
            .post("/api/solve")
            .send({ puzzle: longPuzzle })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' });
                done();
            });
    });

    test("Solve a puzzle that cannot be solved: POST request to /api/solve", (done) => {
        let unsolvablePuzzle = "115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";  
        
        chai.request(server)
            .post("/api/solve")
            .send({ puzzle: unsolvablePuzzle })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { error: 'Puzzle cannot be solved' });
                done();
            });
    });

    test("Check a puzzle placement with all fields: POST request to /api/check", (done)=>{
        chai.request(server)
            .post("/api/check")
            .send({ puzzle: validTest, coordinate: "A2", value: "3" })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isTrue(res.body.valid);
                done();
            });
    });

    test("Check a puzzle placement with single placement conflict: POST request to /api/check",(done)=>{
        chai.request(server)
            .post("/api/check")
            .send({ puzzle: validTest, coordinate: "A2", value: "8" })
            .end(function (err, res) {
                assert.equal(res.status, 200, 'Response status should be 200');
                assert.isFalse(res.body.valid, 'Placement should not be valid');
                assert.equal(res.body.conflict.length, 1);
                done();
            });
    });
    test("Check a puzzle placement with multiple placement conflict: POST request to /api/check",(done)=>{
        chai.request(server)
            .post("/api/check")
            .send({ puzzle: validTest, coordinate: "C3", value: "1" })
            .end(function (err, res) {
                assert.equal(res.status, 200, 'Response status should be 200');
                assert.isFalse(res.body.valid, 'Placement should not be valid');
                assert.equal(res.body.conflict.length, 2);
                done();
            });
    });
    test("Check a puzzle placement with all placement conflict: POST request to /api/check",(done)=>{
        chai.request(server)
            .post("/api/check")
            .send({ puzzle: validTest, coordinate: "A2", value: "2" })
            .end(function (err, res) {
                assert.equal(res.status, 200, 'Response status should be 200');
                assert.isFalse(res.body.valid, 'Placement should not be valid');
                assert.equal(res.body.conflict.length, 3);
                done();
            });
    });
    test("Check a puzzle placement with missing required fields: POST request to /api/check",(done)=>{
        chai.request(server)
            .post("/api/check")
            .send({ puzzle: validTest, coordinate: "A2" })
            .end(function (err, res) {                
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { error: 'Required field(s) missing' }, 'Response body should contain error message for missing field(s)');
                done();
            });
    });
    test("Check a puzzle placement with invalid characters: POST request to /api/check", (done) => {
        let invalidPuzzle = "aaa..2.84..aa.12.7.2..5.....9..1....8.2.3a74.3.7.2..9.47...8..1..16....926914.37.";
        
        chai.request(server)
            .post("/api/check")
            .send({ puzzle: invalidPuzzle, coordinate: "A2", value: "5" })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' });
                done();
            });
    });
    
    test("Check a puzzle placement with incorrect length: POST request to /api/check", (done) => {
        let invalidPuzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..12"; 
        
        chai.request(server)
            .post("/api/check")
            .send({ puzzle: invalidPuzzle, coordinate: "A2", value: "5" })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' });
                done();
            });
    });

    test("Check a puzzle placement with invalid placement coordinate: POST request to /api/check", (done) => {
        let invalidCoordinate = "X12";
        let value = "5";
    
        chai.request(server)
            .post("/api/check")
            .send({ puzzle: validTest, coordinate: invalidCoordinate, value: value })
            .end(function (err, res) {
                assert.equal(res.status, 200); 
                assert.deepEqual(res.body, { error: 'Invalid coordinate' });
                done();
            });
    });

    test("Check a puzzle placement with invalid placement value: POST request to /api/check", (done) => {
        let validCoordinate = "A2";
        let invalidValue = "b";
    
        chai.request(server)
            .post("/api/check")
            .send({ puzzle: validTest, coordinate: validCoordinate, value: invalidValue })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { error: 'Invalid value' }, 'Response body should contain error message for invalid value');
                done();
            });
    });
    
    
    



});
