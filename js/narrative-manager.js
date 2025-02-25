/**
 * Árbol Narrativo para Cripto Revolución – La Jugada de Milei.
 * Cada nodo contiene:
 * - text: Narrativa del nodo.
 * - choices: Opciones disponibles; cada opción incluye:
 *    • text: Texto de la opción.
 *    • next: id del siguiente nodo.
 *    • miniGame: (opcional) tipo de minijuego ("identificacion", "negociacion", "soborno").
 *    • effect: Objeto con cambios en facciones.
 */
export const narrativeTree = {
  start: {
    text: "El escándalo cripto de Milei amenaza con desatar una investigación devastadora. La comisión investigadora se votará en breve, lo que podría exponer el escándalo. Tu misión es comprar la lealtad de diputados y senadores corruptos para evitar la aprobación de la comisión. ¿Qué estrategia emplearás?",
    choices: [
      { text: "Identificar a los corruptos", next: "identificar", miniGame: "identificacion" },
      { text: "Ofrecer cargos y favores", next: "ofrecer_cargos", miniGame: "negociacion" },
      { text: "Ofrecer dinero", next: "ofrecer_dinero", miniGame: "soborno" }
    ]
  },
  identificar: {
    text: "Has analizado los perfiles y descubierto a varios políticos corruptos. Ahora debes elegir a quién abordar: ¿los peronistas, los radicales o los del PRO?",
    choices: [
      { text: "Peronistas", next: "ofrecer_cargos", miniGame: "negociacion", effect: { poblacion: +5, establishment: -5 } },
      { text: "Radicales", next: "ofrecer_cargos", miniGame: "negociacion", effect: { medios: +5 } },
      { text: "Del PRO", next: "ofrecer_dinero", miniGame: "soborno", effect: { libertarios: +5 } }
    ]
  },
  ofrecer_cargos: {
    text: "Decides ofrecer cargos y favores a cambio de la lealtad de los políticos. Negocia con precisión para convencerlos y evitar que se vote la comisión investigadora.",
    choices: [
      { text: "Negociar exitosamente", next: "final_exito", effect: { medios: +10 } },
      { text: "Negociar mediocremente", next: "final_mitad", effect: { medios: 0 } }
    ]
  },
  ofrecer_dinero: {
    text: "Optas por ofrecer sobornos en efectivo. La precisión es crucial para que acepten tu propuesta sin levantar sospechas y evitar la votación de la comisión investigadora.",
    choices: [
      { text: "Sobornar con éxito", next: "final_exito", effect: { establishment: -10, poblacion: +10 } },
      { text: "Sobornar mal", next: "final_fracaso", effect: { establishment: +5, poblacion: -10 } }
    ]
  },
  final_exito: {
    text: "¡Éxito! Has comprado la lealtad de suficientes diputados y senadores para evitar que se vote la comisión investigadora. Milei se salva del escándalo cripto y el control político queda en tus manos.",
    choices: []
  },
  final_mitad: {
    text: "Aunque lograste ciertos avances, no compraste la lealtad necesaria y la votación se pospone por poco. El futuro es incierto.",
    choices: []
  },
  final_fracaso: {
    text: "El plan ha fracasado. La comisión investigadora fue votada, el escándalo cripto se intensificó y Milei enfrenta graves consecuencias.",
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



