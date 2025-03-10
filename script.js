const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1000;
canvas.height = 600;

const backgroundImage = new Image();
backgroundImage.src = './Sprites/background.jpg';

const board = new Image();
backgroundImage.src = './Sprites/board.png';

function drawBackground() {
    if (backgroundImage.complete) {
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();

    requestAnimationFrame(gameLoop);
}

function gameStart() {
    gameLoop();
}