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


// Create an array to hold all the pieces
var pieces = [];

class Piece {
  constructor(name, color, file, rank) {
    this.name = name;
    this.color = color;
    this.file = file;
    this.rank = rank;
    this.image = new Image();
    this.image.src = `Pieces/Straight/${name}_${color}.svg`;
  }

  draw(ctx, squareSize) {
    ctx.drawImage(this.image, this.file * squareSize, (8 - this.rank - 1) * squareSize, squareSize, squareSize);
  }
}



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

function drawBoard() { 
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      // Set the fill color based on the square color
      ctx.fillStyle = grid[i][j].color;

      // Draw the square
      ctx.fillRect(j * squareSize, i * squareSize, squareSize, squareSize);

      // Set the font and color for the text
      ctx.font = '55px Arial';
      ctx.fillStyle = grid[i][j].color === white[theme] ? black[theme] : white[theme];

      // Draw the file and rank labels
      if (j === 0) { // If it's the first file, draw the rank
        ctx.fillText(grid[i][j].rank, j * squareSize + 5, i * squareSize + 55);
      }
      if (i === 7) { // If it's the first rank, draw the file
        ctx.fillText(grid[i][j].file, j * squareSize + squareSize - 40, i * squareSize + squareSize - 10);
      }
    }
  }
}

// Function to set up the pieces in the initial chess position
function setupPieces() {
  var files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  var ranks = [1, 2, 7, 8];
  var pieceNames = ['rook', 'knight', 'bishop', 'king', 'queen', 'bishop', 'knight', 'rook'];

  for (var i = 0; i < ranks.length; i++) {
    for (var j = 0; j < files.length; j++) {
      var color = ranks[i] <= 2 ? 'white' : 'black';
      var name = ranks[i] === 2 || ranks[i] === 7 ? 'pawn' : pieceNames[j];

      // Create a new Piece object and add it to the pieces array
      var piece = new Piece(name, color, j, 8 - ranks[i]);
      pieces.push(piece);

      // Load the image and start the game loop once all images are loaded
      piece.image.onload = function() {
        if (pieces.every(piece => piece.image.complete)) {
          draw();
        }
      };
    }
  }
}
setupPieces();


// Function to draw the board
function draw () {
  ctx.clearRect(0, 0, width, height);

  drawBoard();

  // Draw the pieces
  for (var i = 0; i < pieces.length; i++) {
    pieces[i].draw(ctx, squareSize);
  }

  console.log('drawn');
}

draw();