// default settings
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1000;
canvas.height = 600;

// board settings
const gridSize = 30; // 30x30 grid
const cellSize = 98; // Each cell is 98x98 pixels
const boardX = 50; // Board start X position
const boardY = 75; // Board start Y position

// loading images
const logoImage = new Image();
logoImage.src = './Sprites/logo.png';

const backgroundImage = new Image();
backgroundImage.src = './Sprites/background.jpg';

const boardImage = new Image();
boardImage.src = './Sprites/board.png';

const diceImage = new Image();
diceImage.src = './Sprites/dice.png';

const p1Image = new Image();
p1Image.src = './Sprites/p1.png';

const p2Image = new Image();
p2Image.src = './Sprites/p2.png';

// variables
const usernameText = document.getElementById('usernameText');
const scoreText = document.getElementById('scoreText');
const timerText = document.getElementById('timerText');
const countdownText = document.getElementById('countdownText');
const rollDiceBtn = document.getElementById('rollDiceBtn');
let score = 0;
let time = 0;
let timerInterval;
let countdownTime = 3;
let countdownInterval;

// Snakes and Ladders positions
// const snakes = {
//     99: 78,
//     90: 48,
//     65: 42,
//     47: 25,
//     33: 10,
// };

// const ladders = {
//     5: 25,
//     20: 44,
//     34: 70,
//     50: 90,
//     75: 98
// };

// Player setup
class Player {
    constructor(name, image) {
        this.name = name;
        this.image = image;
        this.position = 1; // Start at position 1
        this.row = 0;
        this.col = 0;
    }

    move(steps, callback) {
        let targetPosition = this.position + steps;

        if (targetPosition > gridSize * gridSize) {
            let excess = targetPosition - (gridSize * gridSize);
            targetPosition = (gridSize * gridSize) - excess;
        }

        this.animateMovement(targetPosition, callback);
    }

    animateMovement(targetPosition, callback) {
        this.isMoving = true;

        const moveStep = () => {
            if (this.position < targetPosition) {
                this.position++;
            } else if (this.position > targetPosition) {
                this.position--;
            } else {
                this.isMoving = false;
                updateGame();

                setTimeout(() => {
                    if (ladders[this.position] || snakes[this.position]) {
                        let newPos = ladders[this.position] || snakes[this.position];
                        this.position = newPos;
                        updateGame();

                        setTimeout(() => {
                            if (callback) callback();
                        }, 500);
                    } else if (callback) {
                        callback();
                    }
                }, 300);

                return;
            }

            updateGame();
            setTimeout(moveStep, 150);
        };

        moveStep();
    }
}

// Initialize Players
let players = [
    new Player('Player 1', p1Image),
    new Player('Player 2', p2Image)
];

let currentPlayerIndex = 0;

// Dice roll function
rollDiceBtn.addEventListener('click', rollDice);

function rollDice() {
    let diceRoll = Math.floor(Math.random() * 6) + 1;
    let player = players[currentPlayerIndex];

    player.move(diceRoll, () => {
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        updateTurnText();
    });
    player.col = Math.round((player.x - boardX) / cellWidth);
    player.row = Math.round((player.y - boardY) / cellHeight);


    updateGame();

    if (player.position === gridSize * gridSize) {
        alert(`🎉 Congratulations! ${player.name} won the game! 🎉`);
    }
}




// Get position of a cell
// Get accurate cell position on board
// Get accurate player position on the board
// Get accurate player position on the board
const boardWidth = 568;
const boardHeight = 474;
const cols = 5; // Number of columns
const rows = 6; // Number of rows

// Get accurate player position on the board
function getCellPosition(position) {
    let row = Math.floor((position - 1) / cols);
    let col = (position - 1) % cols;

    // Reverse column order for every alternate row (zigzag pattern)
    if (row % 2 === 1) {
        col = cols - 1 - col;
    }

    // Flip row index because board starts from bottom-left
    row = (rows - 1) - row;

    // Get cell size
    let cellWidth = boardWidth / cols;
    let cellHeight = boardHeight / rows;

    // Calculate exact position within the cell
    let x = boardX + col * cellWidth + cellWidth / 2;
    let y = boardY + row * cellHeight + cellHeight / 2;

    return { x, y };
}




function movePlayer(player, steps) {
    let targetPosition = player.position + steps;
    if (targetPosition > rows * cols) {
        targetPosition = rows * cols; // Prevent overflow
    }

    player.position = targetPosition;
    let { x, y } = getCellPosition(player.position);
    
    // ✅ Set exact position, removing drift issues
    player.x = x;
    player.y = y;
}








// Update game visuals
function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawLogo();
    drawBoard();

    players.forEach(drawPlayer);
}
// Debugging: Ensure player images load
p1Image.onload = () => {
    console.log("✅ p1Image loaded successfully!");
    updateGame();
};
p1Image.onerror = () => {
    console.error("❌ Failed to load p1Image. Check file path!");
};

p2Image.onload = () => {
    console.log("✅ p2Image loaded successfully!");
    updateGame();
};
p2Image.onerror = () => {
    console.error("❌ Failed to load p2Image. Check file path!");
};
let playerSize = 50;
// Draw player
function drawPlayer(player) {
    let { x, y } = getCellPosition(player.position);

    console.log(`Drawing ${player.name} at Position: ${player.position}, X: ${x}, Y: ${y}`); // Debugging

    if (player.image.complete) {
        ctx.drawImage(player.image, x - playerSize / 2, y - playerSize / 2, playerSize, playerSize); // Adjusted size & position for visibility
    } else {
        console.log(`${player.name} image not loaded yet!`);
    }
}

// Update turn text
function updateTurnText() {
    document.getElementById('turnIndicator').innerHTML = `${players[currentPlayerIndex].name}'s Turn!`;
}

// Keep your existing functions intact
function countdownStart() {
    countdownTime--;
    countdownInterval = setInterval(() => {
        countdownText.innerHTML = countdownTime;
        if (countdownTime === 0) {
            clearInterval(countdownInterval);
            gameStart();
            countdownText.style.display = 'none';
        }
        countdownTime--;
    }, 1000);
}

function startTimer() {
    timerInterval = setInterval(() => {
        time++;
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;
        let formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        timerText.innerHTML = `${formattedTime}`;
    }, 1000);
}

function drawBackground() {
    if (backgroundImage.complete) {
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    }
}

function drawLogo() {
    if (logoImage.complete) {
        ctx.drawImage(logoImage, (canvas.width / 2) + 250, 100, 150, 150);
    }
}

function drawBoard() {
    if (boardImage.complete) {
        ctx.drawImage(boardImage, boardX, boardY, 568, 474);
    }
}

// function drawStairs() {
//     if (stair1Image.complete && stair2Image.complete) {
//         ctx.drawImage(stair1Image, 370, 380, 132, 134);
//         ctx.drawImage(stair2Image, 250, 100, 132, 134);
//     }
// }

// function drawSnakes() {
//     if (snake1Image.complete && snake2Image.complete) {
//         ctx.drawImage(snake1Image, 150, 225, 77, 184);
//         ctx.drawImage(snake2Image, 450, 300, 70, 120);
//     }
// }

// function gameLoop() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     drawBackground();
//     drawLogo();
//     drawBoard();
//     // drawStairs();
//     // drawSnakes();
//     requestAnimationFrame(gameLoop);
// }

function gameStart() {
    // gameLoop();
    // drawButtons();
    startTimer();
    updateGame();
}
