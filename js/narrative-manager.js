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
    text: "Has decidido comprar a los legisladores radicales para bloquear la investigación. Ahora, juega al minijuego arcade y controla a Milei para recolectar monedas que te permitan derrotar a los enemigos radicales.",
    choices: [
      { text: "Estrategia audaz", next: "final_exito", effect: { medios: +20, establishment: -10 } },
      { text: "Estrategia prudente", next: "final_mitad", effect: { medios: +5 } },
      { text: "Estrategia fallida", next: "final_fracaso", effect: { medios: -10 } }
    ]
  },
  peronist: {
    text: "Optas por comprar a los legisladores peronistas. Enfrenta el minijuego arcade, recoge monedas y derrota a los enemigos peronistas para consolidar tu control.",
    choices: [
      { text: "Negociación brillante", next: "final_exito", effect: { poblacion: +20 } },
      { text: "Negociación moderada", next: "final_mitad", effect: { poblacion: +5 } },
      { text: "Negociación desastrosa", next: "final_fracaso", effect: { poblacion: -10 } }
    ]
  },
  judge: {
    text: "Decides asignar jueces por decreto para evitar la investigación. En el minijuego arcade, controla a Milei, recoge monedas y derrota a los jueces para imponer tu decreto.",
    choices: [
      { text: "Designación impecable", next: "final_exito", effect: { establishment: -20 } },
      { text: "Designación moderada", next: "final_mitad", effect: { establishment: -5 } },
      { text: "Designación desastrosa", next: "final_fracaso", effect: { establishment: +10 } }
    ]
  },
  final_exito: {
    text: "¡Triunfo total! Has evitado la investigación y asegurado el control. Milei se salva gracias a tu astucia y el poder está en tus manos.",
    choices: []
  },
  final_mitad: {
    text: "El éxito fue parcial. Algunas acciones funcionaron, pero la amenaza persiste. El futuro es incierto, pero aún tienes oportunidades.",
    choices: []
  },
  final_fracaso: {
    text: "El plan ha fracasado. La investigación se inicia y el escándalo cripto se desata, llevando a consecuencias devastadoras.",
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
