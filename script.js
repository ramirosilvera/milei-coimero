document.addEventListener("DOMContentLoaded", function () {
  // Variables globales del juego
  let favores = 10;
  let congreso = 0; // Contador del Senado (acumula senadores presentes)
  let comprados = 0; // Senadores radicales o peronistas comprados
  const maxComprados = 5;
  let venderCount = 0;
  const maxVender = 3;
  let voucherUsed = false;
  let purchaseEnabled = true;
  let congressInterval, donationInterval, hintInterval;
  let gameActive = false;
  let finalTitle = "";
  let finalMessage = "";
  let interveneCooldown = false;
  let congressIncrement = 5; // Incremento normal en el Senado cada intervalo

  // Definición de candidatos (ahora senadores)
  // Se reemplaza el candidato "libertario" por "del PRO"
  let candidates = [
    { id: 1, type: "radical", name: "Senador Radical 1", basePrice: 10, currentPrice: 10 },
    { id: 2, type: "peronista", name: "Senador Peronista 1", basePrice: 15, currentPrice: 15 },
    { id: 3, type: "pro", name: "Senador del PRO 1", basePrice: 5, currentPrice: 5 },
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
  const interveneBtn = document.getElementById("interveneBtn");

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

  // Evento para la acción de intervención
  interveneBtn.addEventListener("click", interveneAction);

  // Inicialización del juego
  function initializeGame() {
    favores = 10;
    congreso = 0;
    comprados = 0;
    venderCount = 0;
    voucherUsed = false;
    purchaseEnabled = true;
    gameActive = true;
    congressIncrement = 5;
    // Reinicia los precios base
    candidates.forEach(candidate => {
      candidate.currentPrice = candidate.basePrice;
    });
    renderCandidates();
    updateStats();
    showMessage("¡Que comience la revolución!");
    // Intervalo para el avance del Senado (quorum a 72)
    congressInterval = setInterval(function () {
      congreso += congressIncrement;
      updateStats();
      checkDefeat();
    }, 5000);
    // Intervalo para donaciones
    donationInterval = setInterval(function () {
      favores += 5;
      showMessage("Donación anónima: +5 favores.");
      updateStats();
    }, 20000);
    // Intervalo para mostrar pistas cada 30 segundos
    hintInterval = setInterval(showHint, 30000);
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

  // Función para mostrar pistas si el jugador parece estancado
  function showHint() {
    if (!gameActive) return;
    if (favores < 5) {
      showMessage("Pista: ¡Vende un cargo público para conseguir más favores!");
    } else if (comprados < maxComprados && favores >= 5) {
      showMessage("Pista: Recuerda, solo senadores radicales o peronistas cuentan para ganar.");
    } else if (congreso > 50 && comprados < maxComprados) {
      showMessage("Pista: El Senado se llena rápido, ¡actúa ya!");
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

    // Solo los senadores radicales y peronistas cuentan para la victoria
    if (candidate.type === "radical") {
      comprados++;
      showMessage("Te liberaste del yugo de la casta.");
    } else if (candidate.type === "peronista") {
      comprados++;
      showMessage("Ahora sí, ¡viva la libertad, carajo!");
    } else if (candidate.type === "pro") {
      showMessage("¡El PRO se hace presente en el Senado!");
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

  // Acción de intervención para activar bonos y evitar tiempos muertos
  function interveneAction() {
    if (interveneCooldown) {
      showMessage("Espera, ¡la intervención está en enfriamiento!");
      return;
    }
    interveneCooldown = true;
    interveneBtn.disabled = true;
    let bonus = Math.floor(Math.random() * 3); // 0, 1 o 2
    switch(bonus) {
      case 0:
        favores += 5;
        showMessage("Intervención exitosa: ¡Recibes 5 favores extra!");
        break;
      case 1:
        candidates.forEach(candidate => {
          candidate.currentPrice *= 0.9;
          document.getElementById("price-" + candidate.id).textContent = Math.round(candidate.currentPrice);
        });
        showMessage("Intervención especial: ¡Los precios bajan un 10% por 10 segundos!");
        setTimeout(() => {
          candidates.forEach(candidate => {
            candidate.currentPrice /= 0.9;
            document.getElementById("price-" + candidate.id).textContent = Math.round(candidate.currentPrice);
          });
          showMessage("El efecto de la intervención en precios ha terminado.");
        }, 10000);
        break;
      case 2:
        let originalIncrement = congressIncrement;
        congressIncrement = 2;
        showMessage("Intervención en el Senado: ¡El avance se ralentiza por 10 segundos!");
        setTimeout(() => {
          congressIncrement = originalIncrement;
          showMessage("El ritmo del Senado vuelve a la normalidad.");
        }, 10000);
        break;
    }
    updateStats();
    // Enfriamiento de 60 segundos para la intervención
    setTimeout(() => {
      interveneCooldown = false;
      interveneBtn.disabled = false;
      showMessage("¡La intervención está disponible de nuevo!");
    }, 60000);
  }

  // Eventos aleatorios que afectan la partida
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

  // Condición de victoria: compra 5 senadores (radical o peronista) antes de que el Senado llegue a 72
  function checkVictory() {
    if (comprados >= maxComprados) {
      finalTitle = "¡Misión cumplida!";
      finalMessage = "No habrá comisión investigadora. ¡La casta tiembla ante la revolución!";
      endGame(true);
    }
  }

  // Condición de derrota: el Senado alcanza o supera 72 senadores
  function checkDefeat() {
    if (congreso >= 72) {
      finalTitle = "¡Fracaso total!";
      finalMessage = "La casta llenó el Senado. ¡La revolución se detuvo!";
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
    interveneBtn.disabled = true;
    gameScreen.style.display = "none";
    document.getElementById("endTitle").textContent = finalTitle;
    document.getElementById("endMessage").textContent = finalMessage;
    endScreen.style.display = "flex";
  }
});