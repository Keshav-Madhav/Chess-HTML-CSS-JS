//////////////////////// Variables ////////////////////////


// Getting Dom elements
const board = document.getElementById('board');
const ctx = board.getContext('2d');

const flipButton = document.getElementById('flip');

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

// Flag to keep track of whether the board is flipped
var isBoardFlipped = false;

// Variables to track the currently selected piece and its original position
let selectedPiece = null;
let originalPosition = null;





//////////////////////// Event Listeners ////////////////////////




// Event listener for the flip button
flipButton.addEventListener('click', function() {
  flipBoard();
})


// Event listeners for mouse events
board.addEventListener('mousedown', handleMouseDown);
board.addEventListener('mousemove', handleMouseMove);
board.addEventListener('mouseup', handleMouseUp);



//////////////////////// Classes ////////////////////////

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



//////////////////////// Functions ////////////////////////



// Function to calculate scaled mouse coordinates
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
    let mouseX = mousePos.x;
    const mouseY = mousePos.y;
    let file = Math.floor(mouseX / squareSize);
    let rank = 7 - Math.floor(mouseY / squareSize); // Invert y-coordinate and adjust for flipped ranks

    if (isBoardFlipped) {
      mouseX = board.width - mouseX; // Adjust mouseX for flipped board
      file = 7 - file; // Adjust file for flipped board
    }

    // Update the position of the selected piece
    selectedPiece.file = file;
    selectedPiece.rank = rank;

    // Clear the selected piece and original position
    selectedPiece = null;
    originalPosition = null;
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