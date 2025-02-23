document.addEventListener("DOMContentLoaded", function () {
  /* --- Configuración Inicial --- */
  const initialFavores = 150;
  const winCount = 5; // Diputados necesarios para ganar
  const boardLength = 16;
  const squareSize = 70; // Tamaño de cada casilla en px
  const countdownTotal = 60; // Tiempo en segundos para la cuenta regresiva
  
  let timeLeft = countdownTotal;
  let timerInterval; // Para la cuenta regresiva

  // Jugadores: Milei (usuario) y la Oposición (IA)
  let players = [
    { name: "Milei", position: 0, favores: initialFavores, properties: [] },
    { name: "Oposición", position: 0, favores: initialFavores, properties: [] }
  ];
  let currentPlayerIndex = 0; // 0: Milei, 1: Oposición
  let gameActive = false;
  
  // Definición del tablero: 16 casillas
  let boardSquares = [
    { id: 0, name: "Salida", type: "start" },
    { id: 1, name: "Diputado Radical 1", type: "property", subtype: "radical", cost: 70, rent: 10 },
    { id: 2, name: "Carta Política", type: "event" },
    { id: 3, name: "Diputado Peronista 1", type: "property", subtype: "peronista", cost: 130, rent: 30 },
    { id: 4, name: "Fiscalización", type: "tax", amount: 50 },
    { id: 5, name: "Diputado del PRO 1", type: "property", subtype: "pro", cost: 100, rent: 15 },
    { id: 6, name: "Carta Política", type: "event" },
    { id: 7, name: "Diputado Radical 2", type: "property", subtype: "radical", cost: 80, rent: 12 },
    { id: 8, name: "Tribunal Político", type: "penalty", amount: 40 },
    { id: 9, name: "Diputado Peronista 2", type: "property", subtype: "peronista", cost: 140, rent: 35 },
    { id: 10, name: "Carta Política", type: "event" },
    { id: 11, name: "Diputado del PRO 2", type: "property", subtype: "pro", cost: 110, rent: 18 },
    { id: 12, name: "Fiscalización", type: "tax", amount: 50 },
    { id: 13, name: "Diputado Radical 3", type: "property", subtype: "radical", cost: 90, rent: 14 },
    { id: 14, name: "Carta Política", type: "event" },
    { id: 15, name: "Diputado Peronista 3", type: "property", subtype: "peronista", cost: 150, rent: 40 }
  ];
  
  /* --- Elementos del DOM --- */
  const startScreen = document.getElementById("startScreen");
  const gameScreen = document.getElementById("gameScreen");
  const endScreen = document.getElementById("endScreen");
  const boardContainer = document.getElementById("boardContainer");
  const favoresEl = document.getElementById("favores");
  const turnoEl = document.getElementById("turno");
  const ownedCountEl = document.getElementById("ownedCount");
  const positionEl = document.getElementById("position");
  const timerDisplay = document.getElementById("timerDisplay");
  const messageArea = document.getElementById("messageArea");
  const diceResultEl = document.getElementById("diceResult");
  const rollDiceBtn = document.getElementById("rollDiceBtn");
  const startButton = document.getElementById("startButton");
  const restartButton = document.getElementById("restartButton");
  const orientationWarning = document.getElementById("orientation-warning");
  
  /* --- Función para forzar orientación horizontal --- */
  function checkOrientation() {
    if (window.innerWidth < window.innerHeight) {
      // Modo vertical: mostrar advertencia y ocultar juego
      orientationWarning.style.display = "flex";
      gameScreen.style.display = "none";
    } else {
      orientationWarning.style.display = "none";
      // Si ya inició el juego, mostrar gameScreen; de lo contrario, no interferir
      if (gameActive || startScreen.style.display === "none") {
        gameScreen.style.display = "flex";
      }
    }
  }
  
  window.addEventListener("resize", checkOrientation);
  window.addEventListener("orientationchange", checkOrientation);
  
  /* --- Utilidades --- */
  function updateInfoPanel() {
    let currentPlayer = players[currentPlayerIndex];
    favoresEl.textContent = currentPlayer.favores;
    positionEl.textContent = currentPlayer.position;
    turnoEl.textContent = currentPlayer.name;
    ownedCountEl.textContent = currentPlayer.properties.length;
    timerDisplay.textContent = timeLeft;
    // Solo Milei puede lanzar el dado manualmente
    rollDiceBtn.disabled = (currentPlayer.name !== "Milei");
  }
  
  function showMessage(text) {
    messageArea.textContent = text;
  }
  
  function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
  }
  
  /* --- Tablero Circular --- */
  function createBoard() {
    boardContainer.innerHTML = "";
    const boardDiameter = boardContainer.offsetWidth;
    const centerX = boardDiameter / 2;
    const centerY = boardDiameter / 2;
    const radius = (boardDiameter - squareSize) / 2;
    boardSquares.forEach((sq, index) => {
      const squareDiv = document.createElement("div");
      squareDiv.classList.add("board-square");
      squareDiv.id = "square-" + sq.id;
      squareDiv.innerHTML = `<strong>${sq.name}</strong>`;
      // Asigna clases según el tipo de casilla
      if (sq.type === "start") squareDiv.classList.add("start");
      if (sq.type === "event") squareDiv.classList.add("event");
      if (sq.type === "tax" || sq.type === "penalty") squareDiv.classList.add("tax");
      if (sq.type === "property") squareDiv.classList.add("property");
      // Posicionamiento circular
      const angle = (2 * Math.PI / boardLength) * index - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle) - squareSize / 2;
      const y = centerY + radius * Math.sin(angle) - squareSize / 2;
      squareDiv.style.left = x + "px";
      squareDiv.style.top = y + "px";
      boardContainer.appendChild(squareDiv);
    });
    updateBoard();
  }
  
  function updateBoard() {
    // Remueve fichas anteriores
    document.querySelectorAll(".token").forEach(el => el.remove());
    // Coloca las fichas de ambos jugadores en su casilla actual
    players.forEach((player, index) => {
      const square = document.getElementById("square-" + player.position);
      if (square) {
        const token = document.createElement("div");
        token.classList.add("token");
        token.classList.add(index === 0 ? "milei" : "oposicion");
        square.appendChild(token);
      }
    });
  }
  
  /* --- Procesamiento de Casilla --- */
  function processSquare() {
    let currentPlayer = players[currentPlayerIndex];
    let sq = boardSquares[currentPlayer.position];
  
    if (sq.type === "start") {
      showMessage(`${currentPlayer.name} pisa Salida: ¡El juego arranca con fuerza! Recibe 50 favores.`);
      currentPlayer.favores += 50;
    } else if (sq.type === "property") {
      if (currentPlayer.properties.includes(sq.id)) {
        showMessage(`${currentPlayer.name} ya tiene a ${sq.name}. ¡Sigue avanzando en la lucha!`);
      } else {
        if (currentPlayer.favores >= sq.cost) {
          if (currentPlayer.name === "Milei") {
            let confirmBuy = confirm(`Caíste en ${sq.name} (${sq.subtype.toUpperCase()}). ¿Lo compras por ${sq.cost} favores?`);
            if (confirmBuy) {
              currentPlayer.favores -= sq.cost;
              currentPlayer.properties.push(sq.id);
              showMessage(`¡Milei arremete y compra a ${sq.name}! Se niega la comisión investigadora.`);
            } else {
              showMessage(`Milei decide esperar... ¡La batalla sigue!`);
            }
          } else { // Turno de la Oposición (IA)
            currentPlayer.favores -= sq.cost;
            currentPlayer.properties.push(sq.id);
            showMessage(`La Oposición se hace con ${sq.name}. ¡El quorum se acerca para la comisión investigadora!`);
          }
        } else {
          showMessage(`${currentPlayer.name} no tiene suficientes favores para comprar ${sq.name}.`);
        }
      }
    } else if (sq.type === "tax") {
      currentPlayer.favores -= sq.amount;
      showMessage(`${currentPlayer.name} sufre fiscalización: -${sq.amount} favores. ¡La presión aumenta!`);
    } else if (sq.type === "penalty") {
      currentPlayer.favores -= sq.amount;
      showMessage(`${currentPlayer.name} enfrenta el Tribunal: -${sq.amount} favores. ¡La situación se complica!`);
    } else if (sq.type === "event") {
      triggerEvent(currentPlayer);
    }
    updateInfoPanel();
    updateBoard();
    checkGameStatus();
  }
  
  function triggerEvent(player) {
    const events = [
      { message: `${player.name} recibe una Donación Secreta: +30 favores. ¡La fortuna interviene!`, effect: () => { player.favores += 30; } },
      { message: `${player.name} sufre una Denuncia Mediática: -20 favores. ¡La prensa no perdona!`, effect: () => { player.favores -= 20; } },
      { message: `${player.name} enfrenta una Sublevación Interna y pierde un diputado clave. ¡La discordia sacude el Congreso!`, effect: () => {
          if (player.properties.length > 0) {
            let lost = player.properties.pop();
            let prop = boardSquares.find(s => s.id === lost);
            showMessage(`${player.name} pierde a ${prop.name} en medio del caos.`);
          } else {
            showMessage(`${player.name} intenta rebelarse, pero no tiene diputados que perder.`);
          }
        } }
    ];
    let ev = events[Math.floor(Math.random() * events.length)];
    ev.effect();
    showMessage(ev.message);
  }
  
  /* --- Movimiento y Turno --- */
  function movePlayer(steps) {
    let currentPlayer = players[currentPlayerIndex];
    let prevPos = currentPlayer.position;
    currentPlayer.position = (currentPlayer.position + steps) % boardLength;
    if (currentPlayer.position < prevPos) {
      currentPlayer.favores += 50;
      showMessage(`${currentPlayer.name} pasa por Salida y recibe 50 favores. ¡Un impulso decisivo!`);
    }
    updateInfoPanel();
    updateBoard();
    processSquare();
  }
  
  function switchTurn() {
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    updateInfoPanel();
    // Si es turno de la Oposición, simula su jugada tras un breve retraso
    if (players[currentPlayerIndex].name === "Oposición" && gameActive) {
      setTimeout(machineTurn, 1500);
    }
  }
  
  function machineTurn() {
    let dice = rollDice();
    diceResultEl.textContent = `La Oposición saca ${dice}`;
    movePlayer(dice);
    switchTurn();
  }
  
  /* --- Cuenta Regresiva --- */
  function startTimer() {
    timeLeft = countdownTotal;
    timerDisplay.textContent = timeLeft;
    timerInterval = setInterval(() => {
      timeLeft--;
      timerDisplay.textContent = timeLeft;
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        if (gameActive) {
          // Si el tiempo se agota, la Oposición gana
          endGame(true, players.find(p => p.name === "Oposición"));
        }
      }
    }, 1000);
  }
  
  /* --- Comprobación de Condiciones de Victoria/Derrota --- */
  function checkGameStatus() {
    let currentPlayer = players[currentPlayerIndex];
    // Solo Milei pierde por saldo negativo; la Oposición no se pierde por favores negativos.
    if (currentPlayer.name === "Milei" && currentPlayer.favores < 0) {
      endGame(false, currentPlayer);
      return;
    }
    if (currentPlayer.properties.length >= winCount) {
      endGame(true, currentPlayer);
      return;
    }
    updateInfoPanel();
  }
  
  function endGame(victory, player) {
    gameActive = false;
    clearInterval(timerInterval);
    rollDiceBtn.disabled = true;
    const endTitle = document.getElementById("endTitle");
    const endMessage = document.getElementById("endMessage");
    if (victory) {
      if (player.name === "Milei") {
        endTitle.textContent = "¡Victoria Rotunda de Milei!";
        endMessage.textContent = "¡Has bloqueado la comisión investigadora y frustrado el escándalo cripto!";
      } else {
        endTitle.textContent = "¡La Oposición Triunfa!";
        endMessage.textContent = "¡El tiempo se agotó y la oposición asegura la comisión investigadora!";
      }
    } else {
      endTitle.textContent = `¡Derrota Total de ${player.name}!`;
      endMessage.textContent = "Se han agotado los favores. La comisión investigadora ha tomado control.";
    }
    gameScreen.style.display = "none";
    endScreen.style.display = "flex";
  }
  
  /* --- Eventos de Botón --- */
  rollDiceBtn.addEventListener("click", function () {
    if (!gameActive) return;
    rollDiceBtn.disabled = true;
    let dice = rollDice();
    diceResultEl.textContent = `${players[currentPlayerIndex].name} saca ${dice}`;
    movePlayer(dice);
    if (gameActive) {
      setTimeout(switchTurn, 1000);
    }
  });
  
  startButton.addEventListener("click", function () {
    startScreen.style.display = "none";
    gameScreen.style.display = "flex";
    initializeGame();
  });
  
  restartButton.addEventListener("click", function () {
    endScreen.style.display = "none";
    gameScreen.style.display = "flex";
    initializeGame();
  });
  
  /* --- Inicialización del Juego --- */
  function initializeGame() {
    players.forEach(player => {
      player.position = 0;
      player.favores = initialFavores;
      player.properties = [];
    });
    currentPlayerIndex = 0;
    gameActive = true;
    diceResultEl.textContent = "";
    showMessage("¡Que comience la batalla! Milei, lanza el dado para avanzar y bloquear la comisión investigadora.");
    updateInfoPanel();
    createBoard();
    startTimer();
    checkOrientation();
  }
  
  // Mostrar la pantalla de inicio al cargar y verificar orientación
  startScreen.style.display = "flex";
  checkOrientation();
});