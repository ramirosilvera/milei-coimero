const CELL_TYPES = {
    RADICAL: {name: 'Radical', color: '#3498db', cost: 20, symbol: '🔵'},
    PRO: {name: 'PRO', color: '#e74c3c', cost: 30, symbol: '🔴'},
    PERONISTA: {name: 'Peronista', color: '#9b59b6', cost: 40, symbol: '🟣'},
    OPOSICION: {color: '#2ecc71', effect: 'quorum', symbol: '⚠️'},
    FAVOR: {color: '#f1c40f', effect: 'money', symbol: '💰'}
};

let gameState = {
    playerPosition: 0,
    oppositionPosition: 0,
    senatorsBought: 0,
    money: 150,
    timeLeft: 60,
    gameActive: false,
    cells: []
};

function createBoard() {
    const board = document.getElementById('board');
    const radius = board.offsetWidth / 2 - 60;
    const angleStep = (2 * Math.PI) / 24;

    for(let i = 0; i < 24; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        
        const angle = angleStep * i - Math.PI/2;
        const x = radius + radius * Math.cos(angle);
        const y = radius + radius * Math.sin(angle);
        
        cell.style.left = `${x}px`;
        cell.style.top = `${y}px`;
        
        const type = getRandomCellType();
        cell.style.backgroundColor = type.color;
        cell.style.borderColor = type.color;
        cell.innerHTML = `${type.symbol}<br><small>${type.cost ? '$'+type.cost : ''}</small>`;
        cell.dataset.type = JSON.stringify(type);
        
        board.appendChild(cell);
        gameState.cells.push({type, element: cell});
    }
}

function getRandomCellType() {
    const rand = Math.random();
    if(rand < 0.35) return CELL_TYPES.RADICAL;
    if(rand < 0.60) return CELL_TYPES.PRO;
    if(rand < 0.80) return CELL_TYPES.PERONISTA;
    if(rand < 0.95) return CELL_TYPES.OPOSICION;
    return CELL_TYPES.FAVOR;
}

function movePlayer(steps) {
    gameState.playerPosition = (gameState.playerPosition + steps) % 24;
    const cell = gameState.cells[gameState.playerPosition];
    showCellEffect(cell.element);
    handleCellEffect(cell.type);
    updatePlayerPosition();
}

function showCellEffect(element) {
    element.classList.add('pulse');
    setTimeout(() => element.classList.remove('pulse'), 1000);
}

function handleCellEffect(type) {
    if([CELL_TYPES.RADICAL, CELL_TYPES.PRO, CELL_TYPES.PERONISTA].includes(type)) {
        const confirmar = confirm(`¿Comprar ${type.name} por $${type.cost}?`);
        if(confirmar) tryPurchase(type);
    } else if(type === CELL_TYPES.OPOSICION) {
        gameState.timeLeft = Math.max(0, gameState.timeLeft - 8);
        document.getElementById('timeBar').style.background = '#ff0000';
        setTimeout(() => document.getElementById('timeBar').style.background = '#e74c3c', 500);
    } else if(type === CELL_TYPES.FAVOR) {
        gameState.money += 25;
        updateUI();
    }
}

function tryPurchase(type) {
    if(gameState.money >= type.cost) {
        gameState.money -= type.cost;
        gameState.senatorsBought++;
        updateUI();
        checkWin();
        return true;
    }
    alert('¡Fondos insuficientes!');
    return false;
}

function updatePlayerPosition() {
    const player = document.getElementById('player') || createToken('player', '#f1c40f');
    const cell = gameState.cells[gameState.playerPosition].element;
    const rect = cell.getBoundingClientRect();
    player.style.left = `${rect.left + rect.width/2 - 12}px`;
    player.style.top = `${rect.top + rect.height/2 - 12}px`;
}

function createToken(id, color) {
    const token = document.createElement('div');
    token.id = id;
    token.className = 'player';
    token.style.background = color;
    document.body.appendChild(token);
    return token;
}

function updateUI() {
    document.getElementById('senatorsCount').textContent = gameState.senatorsBought;
    document.getElementById('money').textContent = gameState.money;
    document.getElementById('timeText').textContent = gameState.timeLeft;
    document.getElementById('timeBar').style.width = `${(gameState.timeLeft/60)*100}%`;
}

function checkWin() {
    if(gameState.senatorsBought >= 7) {
        endGame(true);
    }
}

function endGame(won) {
    gameState.gameActive = false;
    const modal = document.getElementById('gameOverModal');
    const text = document.getElementById('gameOverText');
    text.innerHTML = won ? '🎉 ¡Victoria Libertaria!<br>Milei gana' : '💀 ¡Derrota!<br>La oposición domina';
    modal.style.display = 'flex';
}

function startGame() {
    document.getElementById('instructionsModal').style.display = 'none';
    gameState.gameActive = true;
    createToken('opposition', '#e74c3c');
    gameLoop();
}

function gameLoop() {
    const timer = setInterval(() => {
        if(!gameState.gameActive) {
            clearInterval(timer);
            return;
        }
        
        gameState.timeLeft--;
        updateUI();
        
        if(gameState.timeLeft <= 0) endGame(false);
    }, 1000);

    setInterval(() => {
        if(gameState.gameActive) {
            gameState.oppositionPosition = (gameState.oppositionPosition + 1) % 24;
            const opposition = document.getElementById('opposition');
            const cell = gameState.cells[gameState.oppositionPosition].element;
            const rect = cell.getBoundingClientRect();
            opposition.style.left = `${rect.left + rect.width/2 - 15}px`;
            opposition.style.top = `${rect.top + rect.height/2 - 15}px`;
        }
    }, 2000);
}

// Event Listeners
document.getElementById('rollDice').addEventListener('click', () => {
    if(!gameState.gameActive) return;
    
    const dice = Math.floor(Math.random() * 6) + 1;
    movePlayer(dice);
});

// Orientación
function checkOrientation() {
    const warning = document.getElementById('orientationWarning');
    warning.style.display = window.innerHeight > window.innerWidth ? 'flex' : 'none';
}

window.addEventListener('resize', checkOrientation);
window.addEventListener('load', () => {
    createBoard();
    checkOrientation();
    document.getElementById('instructionsModal').style.display = 'flex';
});

// Bloquear orientación
screen.orientation?.lock('landscape').catch(() => {});