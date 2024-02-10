//////////////////////// Variables ////////////////////////


// Getting Dom elements
const board = document.getElementById('board');
const ctx = board.getContext('2d');

// Set the size of the board
const size = Math.min(window.innerWidth, window.innerHeight);
var cssWidth = width = size * 0.9;
var cssHeight = height = size * 0.9;

// Set the canvas size in pixels
var pixelWidth = 2000;
var pixelHeight = 2000;

// Set the width and height of the canvas in pixels
board.width = pixelWidth;
board.height = pixelHeight;

// Scale the canvas using CSS
board.style.width = cssWidth + 'px';
board.style.height = cssHeight + 'px';

// Calculate the size of a square
var squareSize = pixelWidth / 8;

// Color definitions
const black = ['#769656', '#b88762']
const white = ['#eeeed2', '#f0d9b5']
var theme = 0;

// Function to create the board grid
function createBoardGrid() {
  var grid = [];
  var files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

  for (var i = 0; i < 8; i++) {
    var row = [];
    for (var j = 0; j < 8; j++) {
      row.push({
        color: (i + j) % 2 === 0 ? white[theme] : black[theme],
        file: files[j],
        rank: 8 - i
      });
    }
    grid.push(row);
  }
  return grid;
}
let grid = createBoardGrid();
