// default settings
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1000;
canvas.height = 600;

// loading images
const logoImage = new Image();
logoImage.src = './Sprites/logo.png';

const backgroundImage = new Image();
backgroundImage.src = './Sprites/background.jpg';

const boardImage = new Image();
boardImage.src = './Sprites/board.png';

const diceImage = new Image();
diceImage.src = './Sprites/dice.png';

const snake1Image = new Image();
snake1Image.src = './Sprites/snake1.png';

const snake2Image = new Image();
snake2Image.src = './Sprites/snake2.png';

const stair1Image = new Image();
stair1Image.src = './Sprites/stair1.png';

const stair2Image = new Image();
stair2Image.src = './Sprites/stair2.png';

const comImage = new Image();
comImage.src = './Sprites/com.png';

const p1Image = new Image();
p1Image.src = './Sprites/p1.png';

const p2Image = new Image();
p2Image.src = './Sprites/p2.png';

// variables
const usernameText = document.getElementById('usernameText');
const scoreText = document.getElementById('scoreText');
const timerText = document.getElementById('timerText');
const countdownText = document.getElementById('countdownText');
const gameButtons = document.getElementById('gameButtons');
let score = 0;
let time = 0;
let timerInterval;
let countdownTime = 3;
let countdownInterval;

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

    }, 1000)
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
        ctx.drawImage(boardImage, 50, 75, 568, 474);
    }
}

function drawStairs() {
    if (stair1Image.complete && stair2Image.complete) {
        ctx.drawImage(stair1Image, 370, 380, 132, 134);
        ctx.drawImage(stair2Image, 250, 100, 132, 134);
    }
}

function drawSnakes() {
    if (snake1Image.complete && snake2Image.complete) {
        ctx.drawImage(snake1Image, 150, 225, 77, 184);
        ctx.drawImage(snake2Image, 450, 300, 70, 120);
    }
}

function drawButtons() {
    gameButtons.style.display = 'flex';
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawLogo();
    drawBoard();
    drawStairs();
    drawSnakes();

    requestAnimationFrame(gameLoop);
}

function gameStart() {
    gameLoop();
    drawButtons();
    startTimer();
}
