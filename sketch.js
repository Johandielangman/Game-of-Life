// ~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~
//      /\_/\
//     ( o.o )
//      > ^ <
//
// Author: Johan Hanekom
// Date: March 2025
//
// ~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~

// =============== // GLOBAL VARIABLES // ===============

let grid;
let cols;
let rows ;
let resolution = 20;

// =============== // HELPER FUNCTIONS // ===============

/**
 * Creates a 2D array with the specified number of columns and rows.
 *
 * @param {number} cols - The number of columns for the 2D array.
 * @param {number} rows - The number of rows for the 2D array.
 * @returns {Array<Array<number|undefined>>} A 2D array initialized with integers (0 or 1) or undefined.
 */
function make2DArray(cols, rows){
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++){
    arr[i] = new Array(rows);
  }
  return arr
}


/**
 * Sets the grid size (cols and rows) as well as the initial 2D array given a resolution
*/
function setGridSize(){
  cols = int(width / resolution);
  rows = int(height / resolution);
  grid = make2DArray(cols, rows);
}


/**
 * Initializes the 2D grid array with a random set of values between 0 an 1
 * 0 is dead and 1 is alive.
*/
function initGrid(){
  for (let i = 0; i < cols; i++){
    for (let j = 0; j < rows; j++){
      // random number between 0 and up to (but not including) 2
      // floor to make it a number between 0 and 1
      grid[i][j] = floor(random(2));
    }
  }
}


/**
 * A function that will render the current the current `grid` state.
 * It simply loops over the 2D Array and plots a white square if the value is
 * set to 1. The resolution is used to determine the starting and ending positions of
 * the squares to render.
*/
function renderCurrentState() {
  for (let i = 0; i < cols; i++){
    for (let j = 0; j < rows; j++){
      let x = i * resolution;
      let y = j * resolution;
      if (grid[i][j] == 1){
        fill(255);
        stroke(0);
        rect(x, y, resolution - 1, resolution - 1);
      }
    }
  }
}


/**
 * Given a grid, and a center point (index coordinates in the 2D array), this function will sum
 * all of the neighbors in around the center point. The edges will wrap-around to the other side.
 * 
 * @param {Array<Array<number>>} gird - a grid with a minimum size of 3 x 3
 * @param {number} x - a column index position in the grid
 * @param {number} y - a row index position in the grid
*/
function countNeighbors(grid, x, y){
  let sum = 0;
  for (let i = -1; i < 2; i++){
    for (let j = -1; j < 2; j++){
      let col = (x + i + cols) % cols;
      let row = (y + j + rows) % rows;
      sum += grid[col][row];
    }
  }
  sum -= grid[x][y];
  return sum
}

// =============== // P5 SETUP AND DRAW // ===============

function setup() {
  createCanvas(windowWidth, windowHeight);
  setGridSize();
  initGrid();
}

function draw() {
  background(0);
  renderCurrentState();

  // Create a clean slate
  let next = make2DArray(cols, rows);

  for (let i = 0; i < cols; i++){
    for (let j = 0; j < rows; j++){

      // =====>> Get params for current state
      let neighbors = countNeighbors(grid, i, j)
      let currentState = grid[i][j];

      // =====>> Currently dead, but 3 live neighbors, set to alive
      if (currentState == 0 && neighbors == 3){
        next[i][j] = 1

      // =====>> Kill there is less than 2 more than three neighbors
      } else if (currentState == 1 && (neighbors < 2 || neighbors > 3)){
        next[i][j] = 0;

      // =====>> Else, do nothing
      } else {
        next[i][j] = currentState;
      }
    }
  }

  // Update the current state to the next state
  grid = next;
}
