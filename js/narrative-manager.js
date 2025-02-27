/**
 * Árbol Narrativo para Milei el gran soborno.
 * Cada nodo contiene:
 * - text: Narrativa.
 * - choices: Opciones disponibles; cada opción incluye:
 *    • text: Texto de la opción.
 *    • next: id del siguiente nodo.
 *    • miniGame: (opcional) tipo de minijuego ("radical", "peronist", "judge").
 *    • effect: Objeto con cambios en facciones.
 */
export const narrativeTree = {
  start: {
    text: "El escándalo cripto de Milei amenaza con iniciar una investigación devastadora. Para evitarlo, debes comprar la lealtad de diputados y senadores o manipular el poder judicial. ¿Qué estrategia emplearás?",
    choices: [
      { text: "Comprar Diputados y Senadores Radicales", next: "radical", miniGame: "radical" },
      { text: "Comprar Diputados y Senadores Peronistas", next: "peronist", miniGame: "peronist" },
      { text: "Asignar jueces por decreto", next: "judge", miniGame: "judge" }
    ]
  },
  radical: {
    text: "Has decidido comprar a los legisladores radicales. Ahora debes demostrar tu habilidad en un minijuego arcade: controla a Milei, recoge 3 monedas y derrota al enemigo radical.",
    choices: [
      { text: "Estrategia audaz", next: "final_exito", effect: { medios: +20, establishment: -10 } },
      { text: "Estrategia prudente", next: "final_mitad", effect: { medios: +5 } },
      { text: "Estrategia fallida", next: "final_fracaso", effect: { medios: -10 } }
    ]
  },
  peronist: {
    text: "Optas por comprar a los legisladores peronistas. Enfrenta el desafío arcade, recoge 3 monedas y derrota al enemigo peronista para consolidar tu control.",
    choices: [
      { text: "Negociación brillante", next: "final_exito", effect: { poblacion: +20 } },
      { text: "Negociación moderada", next: "final_mitad", effect: { poblacion: +5 } },
      { text: "Negociación fallida", next: "final_fracaso", effect: { poblacion: -10 } }
    ]
  },
  judge: {
    text: "Decides asignar jueces por decreto. En el minijuego arcade, controla a Milei, recoge 3 monedas y derrota al enemigo juez para imponer tu decreto.",
    choices: [
      { text: "Designación impecable", next: "final_exito", effect: { establishment: -20 } },
      { text: "Designación moderada", next: "final_mitad", effect: { establishment: -5 } },
      { text: "Designación desastrosa", next: "final_fracaso", effect: { establishment: +10 } }
    ]
  },
  final_exito: {
    text: "¡Triunfo total! Has evitado la investigación y asegurado el control político. Milei se salva gracias a tu estrategia y el poder está en tus manos.",
    choices: []
  },
  final_mitad: {
    text: "El éxito fue parcial. Aunque lograste comprar parte del poder, la amenaza persiste y el futuro es incierto.",
    choices: []
  },
  final_fracaso: {
    text: "El plan ha fracasado. La investigación se inicia y el escándalo cripto se desata, dejando consecuencias devastadoras.",
    choices: []
  }
};
  
/**
 * Sistema de Facciones.
 */
export class FactionSystem {
  constructor() {
    this.establishment = 50;
    this.medios = 40;
    this.poblacion = 60;
    this.libertarios = 30;
  }
  
  update(effect) {
    for (let key in effect) {
      if (this.hasOwnProperty(key)) {
        this[key] += effect[key];
        this[key] = Phaser.Math.Clamp(this[key], 0, 100);
      }
    }
  }
  
  getStatus() {
    return {
      establishment: this.establishment,
      medios: this.medios,
      poblacion: this.poblacion,
      libertarios: this.libertarios
    };
  }
}

/**
 * Sistema de Logros.
 */
export class AchievementSystem {
  constructor() {
    this.achievements = JSON.parse(localStorage.getItem('achievements')) || [];
  }
  
  unlock(name) {
    if (!this.achievements.includes(name)) {
      this.achievements.push(name);
      console.log(`Logro desbloqueado: ${name}`);
      localStorage.setItem('achievements', JSON.stringify(this.achievements));
    }
    return this.achievements;
  }
}
