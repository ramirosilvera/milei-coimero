document.addEventListener("DOMContentLoaded", function () {
  // Variables globales del juego
  let favores = 10;
  let congreso = 0;
  let comprados = 0;
  const maxComprados = 5;
  let venderCount = 0;
  const maxVender = 3;
  let voucherUsed = false;
  let purchaseEnabled = true;
  let congressInterval, donationInterval, hintInterval;
  let gameActive = false;
  let finalTitle = "";
  let finalMessage = "";

  // Definición de candidatos (senadores)
  let candidates = [
    { id: 1, type: "radical", name: "Senador Radical 1", basePrice: 10, currentPrice: 10 },
    { id: 2, type: "peronista", name: "Senador Peronista 1", basePrice: 15, currentPrice: 15 },
    { id: 3, type: "libertario", name: "Senador Libertario 1", basePrice: 5, currentPrice: 5 },
  ];

  // Elementos del DOM para las pantallas
  const startScreen = document.getElementById("startScreen");
  const gameScreen = document.getElementById("gameScreen");
  const endScreen = document.getElementById("endScreen");

  const favoresEl = document.getElementById("favores");
  const congresoEl = document.getElementById("congreso");
  const compradosEl = document.getElementById("comprados");
  const messageArea = document.getElementById("messageArea");
  const candidateContainer = document.getElementById("candidates");

  const startButton = document.getElementById("startButton");
  const restartButton = document.getElementById("restartButton");

  // Iniciar el juego
  startButton.addEventListener("click", function () {
    startScreen.style.display = "none";
    gameScreen.style.display = "block";
    initializeGame();
  });

  // Reiniciar el juego
  restartButton.addEventListener("click", function () {
    endScreen.style.display = "none";
    gameScreen.style.display = "block";
    resetGame();
    initializeGame();
  });

  // Inicialización del juego
  function initializeGame() {
    favores = 10;
    congreso = 0;
    comprados = 0;
    venderCount = 0;
    voucherUsed = false;
    purchaseEnabled = true;
    gameActive = true;
    candidates.forEach(candidate => {
      candidate.currentPrice = candidate.basePrice;
    });
    renderCandidates();
    updateStats();
    showMessage("¡Que comience la revolución!");
    // Inicia intervalos para eventos y para sugerencias
    congressInterval = setInterval(function () {
      congreso += 5;
      updateStats();
      checkDefeat();
    }, 5000);
    donationInterval = setInterval(function () {
      favores += 5;
      showMessage("Donación anónima: +5 favores.");
      updateStats();
    }, 20000);
    hintInterval = setInterval(showHint, 30000); // Cada 30 segundos se muestra una pista si el juego sigue activo
    scheduleRandomEvent();
  }

  // Reinicia el juego deteniendo intervalos y reseteando banderas
  function resetGame() {
    clearInterval(congressInterval);
    clearInterval(donationInterval);
    clearInterval(hintInterval);
    purchaseEnabled = true;
    gameActive = false;
  }

  // Renderiza las cartas de los senadores
  function renderCandidates() {
    candidateContainer.innerHTML = "";
    candidates.forEach((candidate) => {
      let card = document.createElement("div");
      card.className = "candidate";
      card.id = "candidate-" + candidate.id;
      card.innerHTML = `
          <h3>${candidate.name}</h3>
          <p>Tipo: ${candidate.type.charAt(0).toUpperCase() + candidate.type.slice(1)}</p>
          <p>Precio: <span id="price-${candidate.id}">${Math.round(candidate.currentPrice)}</span> favores</p>
          <button id="buy-${candidate.id}">Comprar</button>
        `;
      candidateContainer.appendChild(card);
      document.getElementById("buy-" + candidate.id).addEventListener("click", function () {
        if (!purchaseEnabled) return;
        comprarSenador(candidate.id);
      });
    });
  }

  // Actualiza las estadísticas del juego
  function updateStats() {
    favoresEl.textContent = Math.floor(favores);
    congresoEl.textContent = congreso;
    compradosEl.textContent = comprados;
  }

  // Muestra mensajes en el área designada
  function showMessage(text) {
    messageArea.textContent = text;
  }

  // Función para mostrar sugerencias si el jugador parece estancado
  function showHint() {
    if (!gameActive) return;
    // Pistas basadas en el estado actual
    if (favores < 5) {
      showMessage("Pista: ¡Vende un cargo público para conseguir más favores!");
    } else if (comprados < maxComprados && favores >= 5) {
      showMessage("Pista: Recuerda que debes comprar senadores radicales o peronistas para ganar.");
    } else if (congreso > 80 && comprados < maxComprados) {
      showMessage("Pista: El Congreso se llena rápido, ¡actúa ya!");
    }
  }

  // Función para comprar un senador
  function comprarSenador(candidateId) {
    let candidate = candidates.find((c) => c.id === candidateId);
    if (favores < candidate.currentPrice) {
      showMessage("No tienes suficientes favores.");
      return;
    }
    favores -= candidate.currentPrice;
    candidate.currentPrice *= 1.15;
    document.getElementById("price-" + candidate.id).textContent = Math.round(candidate.currentPrice);

    if (candidate.type === "radical" || candidate.type === "peronista") {
      comprados++;
      if (candidate.type === "radical") {
        showMessage("Te liberaste del yugo de la casta.");
      } else if (candidate.type === "peronista") {
        showMessage("Ahora sí, ¡viva la libertad, carajo!");
      }
    } else {
      showMessage("¡Bienvenido a las fuerzas del cielo!");
    }
    updateStats();
    checkVictory();
  }

  // Acción del Voucher Libertario
  document.getElementById("voucherBtn").addEventListener("click", function () {
    if (voucherUsed) {
      showMessage("El voucher ya fue utilizado.");
      return;
    }
    voucherUsed = true;
    showMessage("Voucher activado: precios reducidos en un 20% por 10 segundos.");
    candidates.forEach((candidate) => {
      candidate.currentPrice *= 0.8;
      document.getElementById("price-" + candidate.id).textContent = Math.round(candidate.currentPrice);
    });
    setTimeout(() => {
      candidates.forEach((candidate) => {
        candidate.currentPrice /= 0.8;
        document.getElementById("price-" + candidate.id).textContent = Math.round(candidate.currentPrice);
      });
      showMessage("El efecto del voucher ha finalizado.");
    }, 10000);
  });

  // Acción de vender un cargo público
  document.getElementById("venderBtn").addEventListener("click", function () {
    if (venderCount >= maxVender) {
      showMessage("Ya alcanzaste el límite de ventas de cargos públicos.");
      return;
    }
    venderCount++;
    favores += 10;
    showMessage("Cargo vendido. Obtienes 10 favores. (Ventas: " + venderCount + "/" + maxVender + ")");
    updateStats();
  });

  // Eventos aleatorios
  function triggerRandomEvent() {
    const events = ["sublevacion", "oferta", "denuncia"];
    const event = events[Math.floor(Math.random() * events.length)];
    if (event === "sublevacion") {
      if (comprados > 0) {
        comprados--;
        showMessage("¡Sublevación! Un senador se retractó: 'No todos resisten la tentación de la casta...'");
        updateStats();
      }
    } else if (event === "oferta") {
      let randomCandidate = candidates[Math.floor(Math.random() * candidates.length)];
      showMessage("Oferta relámpago en " + randomCandidate.name + " por 10 segundos.");
      randomCandidate.currentPrice *= 0.7;
      document.getElementById("price-" + randomCandidate.id).textContent = Math.round(randomCandidate.currentPrice);
      setTimeout(() => {
        randomCandidate.currentPrice /= 0.7;
        document.getElementById("price-" + randomCandidate.id).textContent = Math.round(randomCandidate.currentPrice);
        showMessage("La oferta relámpago ha finalizado en " + randomCandidate.name + ".");
      }, 10000);
    } else if (event === "denuncia") {
      purchaseEnabled = false;
      showMessage("Denuncia mediática: ¡Los zurdos operadores nos quieren ensuciar! Compras bloqueadas por 5 segundos.");
      setTimeout(() => {
        purchaseEnabled = true;
        showMessage("Las compras se han reactivado.");
      }, 5000);
    }
    scheduleRandomEvent();
  }

  function scheduleRandomEvent() {
    let randomTime = Math.floor(Math.random() * 20000) + 10000;
    setTimeout(triggerRandomEvent, randomTime);
  }

  // Condición de victoria
  function checkVictory() {
    if (comprados >= maxComprados) {
      finalTitle = "¡Misión cumplida!";
      finalMessage = "No habrá comisión investigadora. ¡La casta tiene miedo!";
      endGame(true);
    }
  }

  // Condición de derrota
  function checkDefeat() {
    if (congreso >= 129) {
      finalTitle = "¡Fracaso total!";
      finalMessage = "La casta logró el quórum. Pero no nos rendiremos, ¡volveremos más fuertes!";
      endGame(false);
    }
  }

  // Finaliza el juego mostrando la pantalla de fin
  function endGame(isVictory) {
    clearInterval(congressInterval);
    clearInterval(donationInterval);
    clearInterval(hintInterval);
    purchaseEnabled = false;
    candidates.forEach((candidate) => {
      let btn = document.getElementById("buy-" + candidate.id);
      if (btn) {
        btn.disabled = true;
      }
    });
    document.getElementById("voucherBtn").disabled = true;
    document.getElementById("venderBtn").disabled = true;
    gameScreen.style.display = "none";
    document.getElementById("endTitle").textContent = finalTitle;
    document.getElementById("endMessage").textContent = finalMessage;
    endScreen.style.display = "flex";
  }
});
