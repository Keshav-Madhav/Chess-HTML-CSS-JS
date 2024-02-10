//////////////////////// Variables ////////////////////////

// Getting DOM elements
const board = document.getElementById('board');
const ctx = board.getContext('2d');

const flipButton = document.getElementById('flip');

// Set the size of the board
const size = Math.min(window.innerWidth, window.innerHeight);
var cssWidth = width = size * 0.9; // CSS width of the board
var cssHeight = height = size * 0.9; // CSS height of the board

// Set the canvas size in pixels
var pixelWidth = 2000; // Canvas pixel width
var pixelHeight = 2000; // Canvas pixel height

// Set the width and height of the canvas in pixels
board.width = pixelWidth;
board.height = pixelHeight;

// Scale the canvas using CSS
board.style.width = cssWidth + 'px';
board.style.height = cssHeight + 'px';

// Calculate the size of a square
var squareSize = pixelWidth / 8;

// Color definitions for chessboard squares
const black = ['#769656', '#b88762'];
const white = ['#eeeed2', '#f0d9b5'];
var theme = 1;

// Create an array to hold all the pieces
var pieces = [];

// Flag to keep track of whether the board is flipped
var isBoardFlipped = false;


let selectedPiece = null; // Currently selected piece
let originalPosition = null; // Original position of the selected piece



//////////////////////// Event Listeners ////////////////////////

// Event listener for the flip button
flipButton.addEventListener('click', function() {
  flipBoard();
});

// Event listeners for mouse events
board.addEventListener('mousedown', handleMouseDown);
board.addEventListener('mousemove', handleMouseMove);
board.addEventListener('mouseup', handleMouseUp);

//////////////////////// Classes ////////////////////////

// Class to represent a chess piece
class Piece {
  constructor(name, color, file, rank) {
    this.name = name; // Piece name (e.g., 'pawn', 'rook', etc.)
    this.color = color; // Piece color ('white' or 'black')
    this.file = file; // File position (0-7)
    this.rank = rank; // Rank position (0-7)
    this.image = new Image(); // Image object for the piece
    this.image.src = `Pieces/Straight/${name}_${color}.svg`; // Image source path
  }

  // Method to draw the piece on the canvas
  draw(ctx, squareSize) {
    ctx.drawImage(this.image, this.file * squareSize, (8 - this.rank - 1) * squareSize, squareSize, squareSize);
  }
}

//////////////////////// Functions ////////////////////////

// Function to calculate scaled mouse coordinates relative to the canvas
function getMousePos(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY
  };
}

// Function to handle mouse down event
function handleMouseDown(event) {
  const mousePos = getMousePos(board, event);
  const mouseX = mousePos.x;
  const mouseY = mousePos.y;

  // Iterate over pieces to check if the mouse is over any piece
  for (let i = 0; i < pieces.length; i++) {
    const piece = pieces[i];
    const pieceX = piece.file * squareSize;
    const pieceY = (8 - piece.rank - 1) * squareSize; // Adjust for flipped ranks

    // Check if the mouse is over this piece
    if (mouseX >= pieceX && mouseX < pieceX + squareSize &&
        mouseY >= pieceY && mouseY < pieceY + squareSize) {
      selectedPiece = piece;
      originalPosition = { file: piece.file, rank: piece.rank };
      break; // Exit loop after finding the selected piece
    }
  }
}

// Function to handle mouse move event
function handleMouseMove(event) {
  if (selectedPiece) {
    const mousePos = getMousePos(board, event);
    const mouseX = mousePos.x;
    const mouseY = mousePos.y;
    const file = Math.floor(mouseX / squareSize);
    const rank = 7 - Math.floor(mouseY / squareSize); // Invert y-coordinate and adjust for flipped ranks

    // Redraw the board
    draw();

    // Draw the selected piece at its new position
    selectedPiece.draw(ctx, squareSize);
    ctx.globalAlpha = 0.5; // Make the piece semi-transparent
    ctx.drawImage(selectedPiece.image, file * squareSize, (7 - rank) * squareSize, squareSize, squareSize); // Adjust for flipped ranks
    ctx.globalAlpha = 1; // Restore global alpha to default
  }
}

// Function to handle mouse up event
function handleMouseUp(event) {
  if (selectedPiece) {
    const mousePos = getMousePos(board, event);
    const mouseX = mousePos.x;
    const mouseY = mousePos.y;
    const file = Math.floor(mouseX / squareSize);
    const rank = 7 - Math.floor(mouseY / squareSize); // Invert y-coordinate and adjust for flipped ranks

    // Check if there's already a piece at the new position
    const capturedPieceIndex = pieces.findIndex(piece => piece.file === file && piece.rank === rank);

    // If there's a piece at the new position and it's not the selected piece, remove it
    if (capturedPieceIndex !== -1 && pieces[capturedPieceIndex] !== selectedPiece) {
      pieces.splice(capturedPieceIndex, 1);
    }

    // Update the position of the selected piece
    selectedPiece.file = file;
    selectedPiece.rank = rank;

    // Check for pawn promotion
    promotion(selectedPiece);

    // Clear the selected piece and original position
    selectedPiece = null;
    originalPosition = null;

    // Redraw the board
    draw();
  }
}

// Function to handle pawn promotion
function promotion(piece) {
  // Check if the piece is a pawn and has reached the promotion rank
  if (piece.name === 'pawn' && (piece.rank === 0 || piece.rank === 7)) {
    // Replace the pawn with a queen
    piece.name = 'queen';
    piece.image.src = `Pieces/Straight/queen_${piece.color}.svg`;
  }
}


// Function to move a piece from one position to another
function movePiece(algebraicCurrent, algebraicNew) {
  // Convert algebraic notation to file and rank coordinates
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const fileCurrent = files.indexOf(algebraicCurrent[0]);
  const rankCurrent = parseInt(algebraicCurrent[1]) - 1;
  const fileNew = files.indexOf(algebraicNew[0]);
  const rankNew = parseInt(algebraicNew[1]) - 1;

  // Find the piece at the current position
  const piece = pieces.find(piece => piece.file === fileCurrent && piece.rank === rankCurrent);

  // Find if there's already a piece at the new position
  const capturedPieceIndex = pieces.findIndex(piece => piece.file === fileNew && piece.rank === rankNew);

  // If piece found, move it to the new position
  if (piece) {
    piece.file = fileNew;
    piece.rank = rankNew;
    if (capturedPieceIndex !== -1) {
      // Remove the captured piece from the array
      pieces.splice(capturedPieceIndex, 1);
    }

    // Check for pawn promotion
    promotion(piece);

    draw(); // Redraw the board
  } else {
    console.log('Piece not found at current position.');
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
        color: (i + j) % 2 === 0 ? white[theme] : black[theme], // Alternate colors for squares
        file: files[j],
        rank: 8 - i
      });
    }
    grid.push(row);
  }
  return grid;
}
let grid = createBoardGrid(); // Create the initial board grid

// Function to draw the chessboard
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
      var color = ranks[i] <= 2 ? 'white' : 'black'; // Determine piece color based on rank
      var name = ranks[i] === 2 || ranks[i] === 7 ? 'pawn' : pieceNames[j]; // Determine piece name

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
setupPieces(); // Set up the initial chess position

// Function to flip the chessboard
function flipBoard() {
  // Flip the board
  board.style.transform = isBoardFlipped ? 'rotate(0deg)' : 'rotate(180deg)';

  // Change the pieces' orientation
  for (var i = 0; i < pieces.length; i++) {
    pieces[i].image.src = `Pieces/${isBoardFlipped ? 'Straight' : 'Rotated'}/${pieces[i].name}_${pieces[i].color}.svg`;
  }

  // Flip the flag
  isBoardFlipped = !isBoardFlipped;

  // Redraw the board
  draw();
}

// Function to draw the entire board
function draw() {
  ctx.clearRect(0, 0, width, height); // Clear the canvas

  drawBoard(); // Draw the chessboard

  // Draw the pieces
  for (var i = 0; i < pieces.length; i++) {
    pieces[i].draw(ctx, squareSize);
  }

  console.log('drawn');
}

draw(); // Draw the initial board
