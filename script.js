const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1000;
canvas.height = 600;

// variables
const usernameText = document.getElementById('usernameText');
const scoreText = document.getElementById('scoreText');
const timerText = document.getElementById('timerText');
const gameButtons = document.getElementById('gameButtons');
const turnIndicator = document.getElementById('turnIndicator');
const countdownText = document.getElementById('countdownText');
const rows = 5;
const cols = 6;
const boardWidth = 568;
const boardHeight = 474;
const cellWidth = boardWidth / cols;
const cellHeight = boardHeight / rows;
const offsetX = 50;
const offsetY = 75;
let score = 0;
let timer = 0;
let timerInterval;
let countdown = 3;
let countdownInterval;

// images
const backgroundImage = new Image();
backgroundImage.src = './Sprites/background.jpg';

const boardImage = new Image();
boardImage.src = './Sprites/board.png';

const comImage = new Image();
comImage.src = './Sprites/com.png';

const p1Image = new Image();
p1Image.src = './Sprites/p1.png';

const p2Image = new Image();
p2Image.src = './Sprites/p2.png';

const snake1Image = new Image();
snake1Image.src = './Sprites/snake1.png';

const snake2Image = new Image();
snake2Image.src = './Sprites/snake2.png';

const ladder1Image =  new Image();
ladder1Image.src = './Sprites/stair1.png';

const ladder2Image = new Image();
ladder2Image.src = './Sprites/stair2.png';

const logoImage = new Image();
logoImage.src = './Sprites/logo.png';

const diceImage = new Image();
diceImage.src = './Sprites/dice.png';

function countdownStart() {
    countdownInterval = setInterval(() => {
        countdown--;
        
        if (countdown === 0) {
            clearInterval(countdownInterval);
            gameStart();
            countdownText.style.display = 'none';
        }

        countdownText.innerHTML = countdown;

    }, 1000)
}

function timerStart() {
    timerInterval = setInterval(() => {
        timer++;

        timerText.innerHTML = timer;

    }, 1000);
}

function drawBackground() {
    if (backgroundImage.complete) {
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    }
}

function drawBoard() {

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            let number = (rows - row - 1) * cols + (row % 2 === 0 ? col + 1 : cols - col);
            
            ctx.fillStyle = (row + col) % 2 === 0 ? '#ddd' : '#fff';
            ctx.fillRect(offsetX + col * cellWidth, offsetY + row * cellHeight, cellWidth, cellHeight);
            ctx.strokeRect(offsetX + col * cellWidth, offsetY + row * cellHeight, cellWidth, cellHeight);
            
            ctx.fillStyle = 'black';
            ctx.fillText(number, offsetX + col * cellWidth + 15, offsetY + row * cellHeight + 20);
        }
    }

}

class Player {
    constructor(name, image) {
        this.name = name;
        this.position = 1;
        this.image = image;
        this.isMoving = false;
    }
}


function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawBoard();

    requestAnimationFrame(gameLoop);
}

function gameStart() {
    gameLoop();
    timerStart();
}