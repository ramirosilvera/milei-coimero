// Espera a que se cargue el DOM
document.addEventListener("DOMContentLoaded", function () {
  /* --- Variables de Estado --- */
  const initialFavores = 150;
  let player = {
    position: 0,
    favores: initialFavores,
    properties: [] // Almacenará IDs de propiedades compradas
  };
  const winCount = 5; // Número de propiedades clave (radical o peronista) necesarias para ganar
  let boardSquares = [
    { id: 0, name: "Salida", type: "start" },
    { id: 1, name: "Senador Radical 1", type: "property", subtype: "radical", cost: 100, rent: 20 },
    { id: 2, name: "Carta Política", type: "event" },
    { id: 3, name: "Senador Peronista 1", type: "property", subtype: "peronista", cost: 150, rent: 25 },
    { id: 4, name: "Fiscalización", type: "tax", amount: 50 },
    { id: 5, name: "Senador del PRO 1", type: "property", subtype: "pro", cost: 80, rent: 10 },
    { id: 6, name: "Carta Política", type: "event" },
    { id: 7, name: "Senador Radical 2", type: "property", subtype: "radical", cost: 120, rent: 22 },
    { id: 8, name: "Tribunal Político", type: "penalty", amount: 30 },
    { id: 9, name: "Senador Peronista 2", type: "property", subtype: "peronista", cost: 160, rent: 30 },
    { id: 10, name: "Carta Política", type: "event" },
    { id: 11, name: "Senador del PRO 2", type: "property", subtype: "pro", cost: 90, rent: 12 },
    { id: 12, name: "Fiscalización", type: "tax", amount: 50 },
    { id: 13, name: "Senador Radical 3", type: "property", subtype: "radical", cost: 130, rent: 23 },
    { id: 14, name: "Carta Política", type: "event" },
    { id: 15, name: "Senador Peronista 3", type: "property", subtype: "peronista", cost: 170, rent: 35 }
  ];
  const boardLength = boardSquares.length;
  let gameActive = false;

  /* --- Elementos del DOM --- */
  const startScreen = document.getElementById("startScreen");
  const gameScreen = document.getElementById("gameScreen");
  const endScreen = document.getElementById("endScreen");
  const boardContainer = document.getElementById("boardContainer");
  const favoresEl = document.getElementById("favores");
  const ownedCountEl = document.getElementById("ownedCount");
  const positionEl = document.getElementById("position");
  const messageArea = document.getElementById("messageArea");
  const diceResultEl = document.getElementById("diceResult");
  const rollDiceBtn = document.getElementById("rollDiceBtn");
  const startButton = document.getElementById("startButton");
  const restartButton = document.getElementById("restartButton");

  /* --- Funciones de Utilidad --- */
  function updateInfoPanel() {
    favoresEl.textContent = player.favores;
    positionEl.textContent = player.position;
    // Cuento solo las propiedades de tipo radical o peronista
    const keyProps = player.properties.filter(id => {
      let prop = boardSquares.find(sq => sq.id === id);
      return prop && (prop.subtype === "radical" || prop.subtype === "peronista");
    });
    ownedCountEl.textContent = keyProps.length;
  }

  function showMessage(text) {
    messageArea.textContent = text;
  }

  function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
  }

  function movePlayer(steps) {
    let prevPos = player.position;
    player.position = (player.position + steps) % boardLength;
    // Si se pasó por la casilla 0, se otorga un bono
    if (player.position < prevPos) {
      player.favores += 50;
      showMessage("¡Pasaste por Salida! Recibes 50 favores.");
    }
    updateInfoPanel();
    updateBoard();
    processSquare();
  }

  /* --- Funciones del Tablero --- */
  function createBoard() {
    boardContainer.innerHTML = "";
    boardSquares.forEach(sq => {
      const squareDiv = document.createElement("div");
      squareDiv.classList.add("board-square");
      squareDiv.id = "square-" + sq.id;
      squareDiv.innerHTML = `<strong>${sq.name}</strong>`;
      // Agregar clases según tipo para estilizar
      if (sq.type === "start") squareDiv.classList.add("start");
      if (sq.type === "event") squareDiv.classList.add("event");
      if (sq.type === "tax" || sq.type === "penalty") squareDiv.classList.add("tax");
      if (sq.type === "property") squareDiv.classList.add("property");
      boardContainer.appendChild(squareDiv);
    });
    updateBoard();
  }

  function updateBoard() {
    // Elimina cualquier ficha de casilla
    document.querySelectorAll(".token").forEach(el => el.remove());
    // Agrega la ficha del jugador en la casilla actual
    const currentSquare = document.getElementById("square-" + player.position);
    const tokenDiv = document.createElement("div");
    tokenDiv.classList.add("token");
    currentSquare.appendChild(tokenDiv);
  }

  /* --- Procesamiento de Casilla --- */
  function processSquare() {
    let sq = boardSquares[player.position];
    switch (sq.type) {
      case "start":
        showMessage("Estás en Salida. ¡Buena jugada!");
        break;
      case "property":
        // Si ya es propiedad del jugador, nada pasa
        if (player.properties.includes(sq.id)) {
          showMessage(`Ya posees ${sq.name}.`);
        } else {
          // Ofrecer compra si hay suficientes favores
          if (player.favores >= sq.cost) {
            let confirmBuy = confirm(`Has caído en ${sq.name} (${sq.subtype}). ¿Deseas comprarlo por ${sq.cost} favores?`);
            if (confirmBuy) {
              player.favores -= sq.cost;
              player.properties.push(sq.id);
              showMessage(`¡Compraste ${sq.name}!`);
            } else {
              showMessage(`Decidiste no comprar ${sq.name}.`);
            }
          } else {
            showMessage(`No tienes suficientes favores para comprar ${sq.name}.`);
          }
        }
        break;
      case "tax":
        player.favores -= sq.amount;
        showMessage(`¡Fiscalización! Pierdes ${sq.amount} favores.`);
        break;
      case "penalty":
        player.favores -= sq.amount;
        showMessage(`Tribunal Político: pierdes ${sq.amount} favores.`);
        break;
      case "event":
        triggerEvent();
        break;
    }
    updateInfoPanel();
    checkGameStatus();
  }

  function triggerEvent() {
    // Selecciona aleatoriamente un evento político
    const events = [
      { message: "Donación secreta: +30 favores.", effect: () => { player.favores += 30; } },
      { message: "Denuncia mediática: -20 favores.", effect: () => { player.favores -= 20; } },
      { message: "Sublevación interna: pierdes una propiedad clave.", effect: () => {
          // Remover la última propiedad clave comprada (si existe)
          let keyProps = player.properties.filter(id => {
            let p = boardSquares.find(s => s.id === id);
            return p && (p.subtype === "radical" || p.subtype === "peronista");
          });
          if (keyProps.length > 0) {
            let remId = keyProps[keyProps.length - 1];
            player.properties = player.properties.filter(id => id !== remId);
            showMessage("Sublevación interna: pierdes " + boardSquares.find(s => s.id === remId).name);
          } else {
            showMessage("Sublevación interna: pero no tienes propiedades clave para perder.");
          }
      } }
    ];
    let ev = events[Math.floor(Math.random() * events.length)];
    ev.effect();
    showMessage(ev.message);
  }

  /* --- Comprobación de Condiciones de Victoria/Derrota --- */
  function checkGameStatus() {
    // Derrota si favores < 0
    if (player.favores < 0) {
      endGame(false);
      return;
    }
    // Victoria si posee 5 propiedades clave (radical o peronista)
    let keyProps = player.properties.filter(id => {
      let prop = boardSquares.find(sq => sq.id === id);
      return prop && (prop.subtype === "radical" || prop.subtype === "peronista");
    });
    if (keyProps.length >= winCount) {
      endGame(true);
      return;
    }
  }

  /* --- Función para finalizar el juego --- */
  function endGame(victory) {
    gameActive = false;
    rollDiceBtn.disabled = true;
    if (victory) {
      document.getElementById("endTitle").textContent = "¡Revolución Completa!";
      document.getElementById("endMessage").textContent = "Has monopolizado el poder político. ¡La casta tiembla ante tu fuerza!";
    } else {
      document.getElementById("endTitle").textContent = "¡Fracaso Total!";
      document.getElementById("endMessage").textContent = "Te quedaste sin favores. La comisión investigadora te detuvo.";
    }
    gameScreen.style.display = "none";
    endScreen.style.display = "flex";
  }

  /* --- Eventos de Botones --- */
  rollDiceBtn.addEventListener("click", function () {
    if (!gameActive) return;
    let dice = rollDice();
    diceResultEl.textContent = `¡Saliste ${dice}!`;
    movePlayer(dice);
  });

  startButton.addEventListener("click", function () {
    startScreen.style.display = "none";
    gameScreen.style.display = "block";
    initializeGameState();
  });

  restartButton.addEventListener("click", function () {
    endScreen.style.display = "none";
    gameScreen.style.display = "block";
    initializeGameState();
  });

  /* --- Inicialización del Estado del Juego --- */
  function initializeGameState() {
    // Reiniciar estado del jugador y activar el juego
    player.position = 0;
    player.favores = initialFavores;
    player.properties = [];
    gameActive = true;
    diceResultEl.textContent = "";
    showMessage("¡Comienza tu turno! Lanza el dado para avanzar.");
    updateInfoPanel();
    createBoard();
  }

  // Inicia la aplicación mostrando la pantalla de inicio
  startScreen.style.display = "flex";
});