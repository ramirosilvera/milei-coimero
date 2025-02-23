document.addEventListener("DOMContentLoaded", function () {
  /* --- Configuración Inicial --- */
  const initialFavores = 150;
  const initialInfluencia = 0;
  const winInfluence = 500; // Objetivo de influencia para ganar
  const maxTurnos = 10;
  let turnoActual = 1;
  const countdownTotal = 60; // Tiempo total en segundos para la campaña
  
  let timeLeft = countdownTotal;
  let timerInterval; // Para la cuenta regresiva

  // Estado del juego
  let gameState = {
    favores: initialFavores,
    influencia: initialInfluencia,
    turno: turnoActual
  };

  // Acciones disponibles
  const acciones = {
    propaganda: {
      nombre: "Invertir en Propaganda",
      costo: 20,
      // Ganancia aleatoria de influencia entre 30 y 50
      efecto: () => getRandomInt(30, 50)
    },
    mitin: {
      nombre: "Organizar Mítin",
      costo: 30,
      efecto: () => getRandomInt(40, 70)
    },
    alianza: {
      nombre: "Negociar Alianzas",
      costo: 25,
      efecto: () => getRandomInt(20, 60)
    },
    asesor: {
      nombre: "Contratar Asesores",
      costo: 40,
      efecto: () => getRandomInt(50, 80)
    },
    digital: {
      nombre: "Campaña Digital",
      costo: 15,
      efecto: () => getRandomInt(15, 35)
    },
    investigar: {
      nombre: "Investigar Oposición",
      costo: 30,
      efecto: () => 30 // Fija: +30 influencia
    }
  };

  /* --- Elementos del DOM --- */
  const startScreen = document.getElementById("startScreen");
  const gameScreen = document.getElementById("gameScreen");
  const endScreen = document.getElementById("endScreen");
  const favoresEl = document.getElementById("favores");
  const influenciaEl = document.getElementById("influencia");
  const turnoEl = document.getElementById("turno");
  const timerDisplay = document.getElementById("timerDisplay");
  const messageArea = document.getElementById("messageArea");
  const actionsPanel = document.getElementById("actionsPanel");
  const startButton = document.getElementById("startButton");
  const restartButton = document.getElementById("restartButton");
  const orientationWarning = document.getElementById("orientation-warning");

  /* --- Funciones de Utilidad --- */
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function updateInfoPanel() {
    favoresEl.textContent = gameState.favores;
    influenciaEl.textContent = gameState.influencia;
    turnoEl.textContent = `${gameState.turno}/${maxTurnos}`;
    timerDisplay.textContent = timeLeft;
  }

  function showMessage(text) {
    messageArea.textContent = text;
  }

  /* --- Gestión de Turno y Acciones --- */
  function ejecutarAccion(accionKey) {
    const accion = acciones[accionKey];
    if (gameState.favores < accion.costo) {
      showMessage(`No tienes suficientes favores para ${accion.nombre}.`);
      return;
    }
    // Aplica costo y ganancia
    gameState.favores -= accion.costo;
    const ganancia = accion.efecto();
    gameState.influencia += ganancia;
    showMessage(`Acción: ${accion.nombre} (Costo: ${accion.costo} favores). Ganaste ${ganancia} influencia.`);
    finalizarTurno();
  }

  function finalizarTurno() {
    // Evento aleatorio al finalizar el turno
    aplicarEventoAleatorio();
    gameState.turno++;
    if (gameState.turno > maxTurnos) {
      finalizarCampaña();
    } else {
      updateInfoPanel();
      showMessage(`Turno ${gameState.turno}: Elige tu próxima acción.`);
    }
  }

  function aplicarEventoAleatorio() {
    // 50% de probabilidad de evento
    if (Math.random() < 0.5) {
      const eventos = [
        { mensaje: "Donación Secreta: +30 favores.", efecto: () => { gameState.favores += getRandomInt(20, 40); } },
        { mensaje: "Denuncia Mediática: -20 favores.", efecto: () => { gameState.favores -= getRandomInt(15, 30); } },
        { mensaje: "Aplauso del Público: +20 influencia.", efecto: () => { gameState.influencia += getRandomInt(10, 20); } },
        { mensaje: "Ataque de la Oposición: -30 favores.", efecto: () => { gameState.favores -= getRandomInt(20, 30); } }
      ];
      const evento = eventos[getRandomInt(0, eventos.length - 1)];
      evento.efecto();
      showMessage(evento.mensaje);
    }
  }

  function finalizarCampaña() {
    clearInterval(timerInterval);
    if (gameState.influencia >= winInfluence) {
      // Victoria de Milei
      showMessage("¡Victoria! Has alcanzado la influencia necesaria y bloqueado la comisión investigadora.");
      endGame(true);
    } else {
      showMessage("¡Derrota! No lograste alcanzar la influencia necesaria.");
      endGame(false);
    }
  }

  function endGame(victoria) {
    gameScreen.style.display = "none";
    endScreen.style.display = "flex";
    const endTitle = document.getElementById("endTitle");
    const endMessage = document.getElementById("endMessage");
    if (victoria) {
      endTitle.textContent = "¡Victoria Rotunda de Milei!";
      endMessage.textContent = "Has logrado influir en el Congreso y bloquear la comisión investigadora.";
    } else {
      endTitle.textContent = "¡Derrota Total!";
      endMessage.textContent = "La campaña fracasó y la oposición se impone.";
    }
  }

  /* --- Gestión del Temporizador --- */
  function startTimer() {
    timeLeft = countdownTotal;
    timerDisplay.textContent = timeLeft;
    timerInterval = setInterval(() => {
      timeLeft--;
      timerDisplay.textContent = timeLeft;
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        // Si el tiempo se agota antes de finalizar los turnos, se declara derrota para Milei
        finalizarCampaña();
      }
    }, 1000);
  }

  /* --- Configuración de la Interfaz de Acciones --- */
  function setupActions() {
    actionsPanel.innerHTML = "";
    for (let key in acciones) {
      const btn = document.createElement("button");
      btn.classList.add("action-btn");
      btn.textContent = acciones[key].nombre;
      btn.dataset.accion = key;
      btn.addEventListener("click", function () {
        if (gameActive) {
          ejecutarAccion(this.dataset.accion);
        }
      });
      actionsPanel.appendChild(btn);
    }
  }

  /* --- Inicialización y Reinicio --- */
  function initializeGame() {
    // Reinicia estado de la campaña
    gameState.favores = initialFavores;
    gameState.influencia = initialInfluencia;
    gameState.turno = 1;
    timeLeft = countdownTotal;
    gameActive = true;
    updateInfoPanel();
    showMessage("¡Comienza la campaña! Elige una acción para impulsar tu influencia.");
    setupActions();
    startTimer();
  }

  /* --- Eventos de Botón --- */
  startButton.addEventListener("click", function () {
    startScreen.style.display = "none";
    gameScreen.style.display = "flex";
    endScreen.style.display = "none";
    initializeGame();
  });

  restartButton.addEventListener("click", function () {
    endScreen.style.display = "none";
    gameScreen.style.display = "flex";
    initializeGame();
  });

  /* --- Verificación de Orientación --- */
  function checkOrientation() {
    if (window.innerWidth < window.innerHeight) {
      orientationWarning.style.display = "flex";
    } else {
      orientationWarning.style.display = "none";
    }
  }
  window.addEventListener("resize", checkOrientation);
  window.addEventListener("orientationchange", checkOrientation);
  checkOrientation();
});