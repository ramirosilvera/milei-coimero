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
    text: "El escándalo cripto de Milei está a punto de desencadenar una investigación que podría destruir su carrera. La comisión investigadora se votará en breve, y tú tienes la misión de comprar la lealtad de diputados y senadores para evitar que se apruebe. ¿Cómo comenzarás?",
    choices: [
      { text: "Identificar a los corruptos", next: "identificar", miniGame: "identificacion" },
      { text: "Ofrecer cargos y favores", next: "ofrecer_cargos", miniGame: "negociacion" },
      { text: "Ofrecer dinero", next: "ofrecer_dinero", miniGame: "soborno" }
    ]
  },
  identificar: {
    text: "Después de un exhaustivo análisis, descubres a varios políticos corruptos. Debes decidir con quién negociar: ¿los peronistas, los radicales o los del PRO? La decisión influirá en la estrategia a seguir.",
    choices: [
      { text: "Peronistas", next: "estrategia_peronista", miniGame: "negociacion", effect: { poblacion: +5, establishment: -5 } },
      { text: "Radicales", next: "estrategia_radical", miniGame: "negociacion", effect: { medios: +5 } },
      { text: "Del PRO", next: "ofrecer_dinero", miniGame: "soborno", effect: { libertarios: +5 } }
    ]
  },
  estrategia_peronista: {
    text: "Decides enfocarte en los peronistas. Ahora debes negociar con ellos para ofrecer cargos y favores que aseguren su apoyo sin levantar sospechas. ¿Cómo te comportarás?",
    choices: [
      { text: "Negociación agresiva (alto riesgo, alta recompensa)", next: "final_exito", effect: { medios: +15, poblacion: +5 } },
      { text: "Negociación equilibrada (riesgo moderado)", next: "final_mitad", effect: { medios: +5, poblacion: +5 } },
      { text: "Negociación deficiente (fracaso parcial)", next: "final_fracaso", effect: { medios: -5, poblacion: -5 } }
    ]
  },
  estrategia_radical: {
    text: "Te diriges a los radicales. Su base es fuerte, pero son impredecibles. Debes ofrecerles cargos y favores de manera precisa para ganar su lealtad.",
    choices: [
      { text: "Ofrecer una propuesta contundente", next: "final_exito", effect: { medios: +15 } },
      { text: "Ofrecer una propuesta moderada", next: "final_mitad", effect: { medios: +5 } },
      { text: "Fracasar en la propuesta", next: "final_fracaso", effect: { medios: -5 } }
    ]
  },
  ofrecer_cargos: {
    text: "Decides ofrecer cargos y favores a cambio de lealtad. Debes negociar con precisión para que acepten tu propuesta sin levantar sospechas y evitar la votación de la comisión investigadora.",
    choices: [
      { text: "Negociación arriesgada con altos beneficios", next: "final_exito", effect: { medios: +15, establishment: -10 } },
      { text: "Negociación prudente", next: "final_mitad", effect: { medios: +5 } },
      { text: "Negociación deficiente", next: "final_fracaso", effect: { medios: -5 } }
    ]
  },
  ofrecer_dinero: {
    text: "Optas por ofrecer sobornos en efectivo. La precisión es crucial para entregar el dinero sin levantar sospechas. ¿Cómo ejecutarás el plan?",
    choices: [
      { text: "Soborno perfecto", next: "final_exito", effect: { establishment: -10, poblacion: +10 } },
      { text: "Soborno intermedio", next: "final_mitad", effect: { establishment: -5 } },
      { text: "Soborno desastroso", next: "final_fracaso", effect: { establishment: +5, poblacion: -10 } }
    ]
  },
  final_exito: {
    text: "¡Éxito total! Has comprado la lealtad de suficientes diputados y senadores para evitar que se vote la comisión investigadora. El escándalo cripto queda en el olvido y el poder político se inclina a tu favor.",
    choices: []
  },
  final_mitad: {
    text: "Tu estrategia ha tenido resultados mixtos. Aunque algunos políticos se han comprado, la votación se pospone por poco. El futuro es incierto, pero aún hay margen de maniobra.",
    choices: []
  },
  final_fracaso: {
    text: "El plan ha fracasado. La comisión investigadora es aprobada y el escándalo cripto de Milei se desata, dejando el país al borde del colapso.",
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




