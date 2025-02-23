document.addEventListener("DOMContentLoaded", function () {
  /* --- Configuración Inicial --- */
  const initialFavores = 150;
  const winInfluence = 500; // Influencia necesaria para ganar
  const maxTurnos = 10;
  let turnoActual = 1;
  const countdownTotal = 60; // Tiempo total en segundos para la campaña
  
  let timeLeft = countdownTotal;
  let timerInterval; // Intervalo del temporizador

  // Estado del juego
  let gameState = {
    favores: initialFavores,
    influencia: 0,
    turno: turnoActual
  };

  // Definición de acciones (cartas)
  const acciones = {
    propaganda: {
      nombre: "Invertir en Propaganda",
      costo: 20,
      efecto: () => getRandomInt(30, 50),
      imagen: "assets/images/propaganda.png"
    },
    mitin: {
      nombre: "Organizar Mítin",
      costo: 30,
      efecto: () => getRandomInt(40, 70),
      imagen: "assets/images/mitin.png"
    },
    alianza: {
      nombre: "Negociar Alianzas",
      costo: 25,
      efecto: () => getRandomInt(20, 60),
      imagen: "assets/images/alianza.png"
    },
    asesor: {
      nombre: "Contratar Asesores",
      costo: 40,
      efecto: () => getRandomInt(50, 80),
      imagen: "assets/images/asesor.png"
    },
    digital: {
      nombre: "Campaña Digital",
      costo: 15,
      efecto: () => getRandomInt(15, 35),
      imagen: "assets/images/digital.png"
    },
    investigar: {
      nombre: "Investigar Oposición",
      costo: 30,
      efecto: () => 30,
      imagen: "assets/images/investigar.png"
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
  const actionsPanel = document.getElementById("cardsContainer");
  const startButton = document.getElementById("startButton");
  const restartButton = document.getElementById("restartButton");
  const orientationWarning = document.getElementById("orientation-warning");

  // Sonidos
  const soundCard = document.getElementById("sound-card");
  const soundVictory = document.getElementById("sound-victory");
  const soundDefeat = document.getElementById("sound-defeat");

  /* --- Función de Utilidad --- */
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
    // Reproducir sonido de carta
    soundCard.currentTime = 0;
    soundCard.play();
    
    gameState.favores -= accion.costo;
    const ganancia = accion.efecto();
    gameState.influencia += ganancia;
    showMessage(`Acción: ${accion.nombre} (Costo: ${accion.costo}). Ganaste ${ganancia} influencia.`);
    finalizarTurno();
  }

  function finalizarTurno() {
    aplicarEventoAleatorio();
    gameState.turno++;
    if (gameState.turno > maxTurnos) {
      finalizarCampaña();
    } else {
      updateInfoPanel();
      showMessage(`Turno ${gameState.turno}: Selecciona tu próxima acción.`);
      setupActions();
    }
  }

  function aplicarEventoAleatorio() {
    if (Math.random() < 0.5) {
      const eventos = [
        { mensaje: "Evento: Donación Secreta (+30 favores).", efecto: () => { gameState.favores += getRandomInt(20, 40); } },
        { mensaje: "Evento: Denuncia Mediática (-20 favores).", efecto: () => { gameState.favores -= getRandomInt(15, 30); } },
        { mensaje: "Evento: Aplauso del Público (+20 influencia).", efecto: () => { gameState.influencia += getRandomInt(10, 20); } },
        { mensaje: "Evento: Ataque de la Oposición (-30 favores).", efecto: () => { gameState.favores -= getRandomInt(20, 30); } }
      ];
      const evento = eventos[getRandomInt(0, eventos.length - 1)];
      evento.efecto();
      showMessage(evento.mensaje);
    }
  }

  function finalizarCampaña() {
    clearInterval(timerInterval);
    if (gameState.influencia >= winInfluence) {
      showMessage("¡Victoria! Has alcanzado la influencia necesaria y bloqueado la comisión investigadora.");
      soundVictory.play();
      endGame(true);
    } else {
      showMessage("¡Derrota! No lograste alcanzar la influencia necesaria.");
      soundDefeat.play();
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
      endMessage.textContent = "La campaña ha fracasado y la oposición se impone.";
    }
  }

  /* --- Temporizador --- */
  function startTimer() {
    timeLeft = countdownTotal;
    timerDisplay.textContent = timeLeft;
    timerInterval = setInterval(() => {
      timeLeft--;
      timerDisplay.textContent = timeLeft;
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        finalizarCampaña();
      }
    }, 1000);
  }

  /* --- Configuración de la Interfaz de Acciones (Mano de Cartas) --- */
  function setupActions() {
    actionsPanel.innerHTML = "";
    for (let key in acciones) {
      const card = document.createElement("div");
      card.classList.add("card");
      card.dataset.accion = key;
      // Imagen de la carta
      const img = document.createElement("img");
      img.src = acciones[key].imagen;
      img.alt = acciones[key].nombre;
      card.appendChild(img);
      // Título de la carta
      const title = document.createElement("div");
      title.classList.add("card-title");
      title.textContent = acciones[key].nombre;
      card.appendChild(title);
      // Costo de la carta
      const cost = document.createElement("div");
      cost.classList.add("card-cost");
      cost.textContent = `Costo: ${acciones[key].costo}`;
      card.appendChild(cost);
      card.addEventListener("click", function () {
        if (gameState.favores >= acciones[this.dataset.accion].costo && gameState.turno <= maxTurnos) {
          ejecutarAccion(this.dataset.accion);
        } else {
          showMessage(`No tienes suficientes favores para ${acciones[this.dataset.accion].nombre}.`);
        }
      });
      actionsPanel.appendChild(card);
    }
  }

  /* --- Inicialización y Reinicio --- */
  function initializeGame() {
    gameState.favores = initial