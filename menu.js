// menu
const menuContainer = document.getElementById('menuContainer');
const usernameInput = document.getElementById('usernameInput');
const selectLevel = document.getElementById('selectLevel');
const selectMode = document.getElementById('selectMode');
const startBtn = document.getElementById('startBtn');
const instructionBtn = document.getElementById('instructionBtn');
const instructionContainer = document.getElementById('instructionContainer');
const closeInstructionBtn = document.getElementById('closeInstructionBtn');

// instruction

instructionBtn.addEventListener('click', () => {
    instructionContainer.style.display = 'flex';
})


closeInstructionBtn.addEventListener('click', () => {
    instructionContainer.style.display = 'none';
})

// game
const gameContainer = document.getElementById('gameContainer');

function checkInput() {
    let username = usernameInput.value.trim();
    let selectedLevel = selectLevel.value;
    let selectedMode = selectMode.value;

    startBtn.disabled = username === '' || selectedLevel === '0' || selectedMode === '0';
    usernameText.innerHTML = username;
}

usernameInput.addEventListener('input', checkInput);
selectLevel.addEventListener('change', checkInput);
selectMode.addEventListener('change', checkInput);

checkInput();

startBtn.addEventListener('click', () => {
    
    gameContainer.style.display = 'flex';
    menuContainer.style.display = 'none';

    countdownStart();
})