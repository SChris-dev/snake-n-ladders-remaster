const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1000;
canvas.height = 600;


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

// variables
const usernameText = document.getElementById('usernameText');
const scoreText = document.getElementById('scoreText');
const timerText = document.getElementById('timerText');
const gameButtons = document.getElementById('gameButtons');
const turnIndicator = document.getElementById('turnIndicator');
const rollDiceBtn = document.getElementById('rollDiceBtn');
const exitSave = document.getElementById('exitSave');
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

const snakes = {
    27: 10,
    22: 5,
    18: 8
};

const ladders = {
    3: 15,
    6: 17,
    11: 26
}

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

function formatTimer(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function timerStart() {
    timerInterval = setInterval(() => {
        timer++;

        timerText.innerHTML = formatTimer(timer);

    }, 1000);
}

function getCellPosition(position) {
    let row = Math.floor((position - 1) / cols);
    let col = (position - 1) % cols;

    if (row % 2 === 1) {
        col = cols - 1 - col;
    }

    row = (rows - 1) - row;

    let x = offsetX + col * cellWidth + cellWidth / 2;
    let y = offsetY + row * cellHeight + cellHeight / 2;

    return { x, y };
}

class Player {
    constructor(name, image) {
        this.name = name;
        this.position = 1;
        this.image = image;
        let startPos = getCellPosition(1);
        this.x = startPos.x;
        this.y = startPos.y;
        this.isMoving = false;
    }

    move(steps, callBack) {
        let targetPosition = this.position + steps;

        if (targetPosition > 30) {
            targetPosition = 30;
        }

        this.animateMovement(targetPosition, () => {
            if (snakes[this.position] || ladders[this.position]) {
                let newPos = snakes[this.position] || ladders[this.position];
    
                setTimeout(() => {
                    this.smoothSlide(newPos, callBack);
                }, 300);
            } else {
                if (callBack) callBack();
            }
        });
    }

    animateMovement(targetPosition, callBack) {
        this.isMoving = true;
    
        let start = getCellPosition(this.position);
        let end = getCellPosition(targetPosition);

        let totalFrames = 10;
        let deltaX = (end.x - start.x) / totalFrames;
        let deltaY = (end.y - start.y) / totalFrames;

        let frame = 0;

        const moveStep = () => {
            if (frame < totalFrames) {
                this.x += deltaX;
                this.y += deltaY;
                gameLoop();
                frame++;
                requestAnimationFrame(moveStep);
            } else {
                this.position = targetPosition;
                let finalPos = getCellPosition(this.position);
                this.x = finalPos.x;
                this.y = finalPos.y;
                this.isMoving = false;
                gameLoop();
                if (callBack) callBack();
            }
        };

        moveStep();
    }

    smoothSlide(targetPosition, callBack) {
        let start = getCellPosition(this.position);
        let end = getCellPosition(targetPosition);

        let totalFrames = 20;
        let deltaX = (end.x - start.x) / totalFrames;
        let deltaY = (end.y - start.y) / totalFrames;

        let frame = 0;

        const slideStep = () => {
            if (frame < totalFrames) {
                this.x += deltaX;
                this.y += deltaY;
                gameLoop();
                frame++;
                requestAnimationFrame(slideStep);
            } else {
                this.position = targetPosition;
                let finalPos = getCellPosition(this.position);
                this.x = finalPos.x;
                this.y = finalPos.y;
                gameLoop();
                if (callBack) callBack();
            }
        };

        slideStep();
    }

}

let players = [
    new Player('P1', p1Image),
    new Player('P2', p2Image)
];

let currentPlayerIndex = 0;


function drawPlayer(player) {
    if (!player.image.complete) return;

    let playerSize = 40;
    ctx.drawImage(player.image, player.x - playerSize / 2, player.y - playerSize / 2, playerSize, playerSize);
} 

const diceCols = 3;
const diceRows = 2;
const diceSize = 118;
let diceFace = 0;

function drawDice() {
    const diceWidth = 137;
    const diceHeight = 132;
    const cols = 3;
    const diceOffsetX = 0;
    const diceOffsetY = 0;

    const sx = (diceFace % cols) * diceWidth + diceOffsetX;
    const sy = Math.floor(diceFace / cols) * diceHeight + diceOffsetY;

    if (!diceImage.complete) return;

    ctx.clearRect(800, 100, diceWidth, diceHeight);
    ctx.drawImage(diceImage, sx, sy, diceWidth, diceHeight, 800, 100, diceWidth, diceHeight)
}

function rollDice() {
    if (players.some(player => player.isMoving)) return;

    let player = players[currentPlayerIndex];
    let diceRoll = Math.floor(Math.random() * 6) + 1;

    rollDiceBtn.disabled = true;

    let rolls = 10;
    let rollInterval = setInterval(() => {
        diceFace = Math.floor(Math.random() * 6);
        drawDice();
        rolls--;

        if (rolls <= 0) {
            clearInterval(rollInterval);
            diceFace = diceRoll - 1;
            drawDice();

            player.move(diceRoll, () => {
                if (player.position === 30) {
                    alert(`${player.name} WINS!`);
                    return;
                }
        
                currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
                rollDiceBtn.disabled = false;
            });

            console.log(`${player.name} rolled ${diceRoll}!`);
        }
    }, 100);


}

rollDiceBtn.addEventListener('click', rollDice);

function drawButtons() {
    gameButtons.style.display = 'flex';
}

function drawBackground() {
    if (backgroundImage.complete) {
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    }
}

function createBoard() {

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

function drawBoard() {
    if (boardImage.complete) {
        ctx.drawImage(boardImage, offsetX, offsetY, boardWidth, boardHeight);
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    createBoard();
    drawBoard();
    drawDice();
    
    players.forEach(drawPlayer);

    requestAnimationFrame(gameLoop);
}

function gameStart() {
    gameLoop();
    drawButtons();
    timerStart();
}