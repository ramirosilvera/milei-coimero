/**
 * Árbol Narrativo para Cripto Revolución.
 * Cada nodo contiene:
 * - text: Narrativa del nodo.
 * - choices: Opciones disponibles; cada opción incluye:
 *    • text: Texto de la opción.
 *    • next: id del siguiente nodo.
 *    • miniGame: (opcional) tipo de minijuego ("identificacion", "negociacion" o "soborno").
 *    • effect: Objeto con cambios en facciones.
 */
export const narrativeTree = {
  start: {
    text: "La crisis política ha alcanzado niveles sin precedentes. Los diputados y senadores están en venta y tu misión es comprar sus votos. Debes actuar con astucia: identifica a los corruptos y ofréceles cargos, dinero o favores. ¿Qué estrategia emprenderás?",
    choices: [
      { text: "Identificar a los corruptos", next: "identificar", miniGame: "identificacion" },
      { text: "Ofrecer cargos y favores", next: "ofrecer_cargos", miniGame: "negociacion" },
      { text: "Ofrecer dinero", next: "ofrecer_dinero", miniGame: "soborno" }
    ]
  },
  identificar: {
    text: "Has analizado los perfiles y descubierto a varios políticos corruptos. Ahora debes decidir a quién abordar: ¿los peronistas, los radicales o los del PRO?",
    choices: [
      { text: "Peronistas", next: "ofrecer_cargos", miniGame: "negociacion", effect: { poblacion: +5, establishment: -5 } },
      { text: "Radicales", next: "ofrecer_cargos", miniGame: "negociacion", effect: { medios: +5 } },
      { text: "Del PRO", next: "ofrecer_dinero", miniGame: "soborno", effect: { libertarios: +5 } }
    ]
  },
  ofrecer_cargos: {
    text: "Decides ofrecer cargos y favores a cambio de lealtad. Debes negociar con precisión para que acepten tu propuesta sin levantar sospechas.",
    choices: [
      { text: "Negociar con éxito", next: "final_exito", effect: { medios: +10 } },
      { text: "Negociar de forma mediocre", next: "final_mitad", effect: { medios: 0 } }
    ]
  },
  ofrecer_dinero: {
    text: "Optas por ofrecer dinero y sobornos. La precisión es crucial para no levantar sospechas y lograr comprar su lealtad.",
    choices: [
      { text: "Sobornar con precisión", next: "final_exito", effect: { establishment: -10, poblacion: +10 } },
      { text: "Sobornar mal", next: "final_fracaso", effect: { establishment: +5, poblacion: -10 } }
    ]
  },
  final_exito: {
    text: "Tus estrategias han sido un éxito. Has comprado la lealtad de los diputados y senadores, y ahora controlas el poder legislativo.",
    choices: []
  },
  final_mitad: {
    text: "Aunque lograste avances, tu estrategia no fue del todo exitosa. El control es parcial y la incertidumbre persiste.",
    choices: []
  },
  final_fracaso: {
    text: "El intento de soborno fue un desastre y el escándalo estalló. Has fracasado en tu misión y el país se sumerge en el caos.",
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


