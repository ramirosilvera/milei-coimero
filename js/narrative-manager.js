/**
 * Árbol Narrativo para Cripto Revolución.
 * Cada nodo contiene:
 * - id: Identificador único.
 * - text: Texto narrativo.
 * - choices: Array de opciones; cada opción contiene:
 *    • text: Texto de la opción.
 *    • next: id del siguiente nodo.
 *    • miniGame: (opcional) tipo de mini-juego ("boicot", "influencia" o "campaña").
 *    • effect: Objeto con cambios en facciones (ej. { establishment: -10, medios: +5 }).
 */
export const narrativeTree = {
  start: {
    text: "La nación está al borde del colapso. Milei, en medio de un escándalo cripto, debe actuar para evitar una investigación que podría derrumbar al establecimiento.",
    choices: [
      { text: "Lanzar un boicot radical", next: "boicot1", miniGame: "boicot", effect: { establishment: -10 } },
      { text: "Manipular a los medios", next: "influencia1", miniGame: "influencia", effect: { medios: +10 } }
    ]
  },
  boicot1: {
    text: "Con un boicot arriesgado, intentas debilitar al sistema. La tensión se siente en cada esquina.",
    choices: [
      { text: "Presiona para intensificar el ataque", next: "boicot2", miniGame: "boicot", effect: { establishment: -15 } },
      { text: "Retrocede y reevalúa la estrategia", next: "regreso", effect: { establishment: +5 } }
    ]
  },
  influencia1: {
    text: "Usas tus contactos en los medios para sembrar dudas sobre la investigación. La opinión pública comienza a inclinarse.",
    choices: [
      { text: "Amplifica el mensaje", next: "influencia2", miniGame: "influencia", effect: { medios: +15 } },
      { text: "Opta por una campaña mediática vibrante", next: "campaña1", miniGame: "campaña", effect: { poblacion: +10 } }
    ]
  },
  boicot2: {
    text: "El ataque se intensifica y logras dañar significativamente la reputación del establecimiento. Pero el riesgo crece...",
    choices: [
      { text: "¡Arriesga todo!", next: "final_exito", effect: { libertarios: +10, establishment: -20 } },
      { text: "Retrocede antes de que sea demasiado tarde", next: "final_mitad", effect: { establishment: -5 } }
    ]
  },
  influencia2: {
    text: "La manipulación se afianza y el discurso mediático está de tu lado. La comisión comienza a tambalearse.",
    choices: [
      { text: "Consolidar el control mediático", next: "final_exito", effect: { medios: +10, poblacion: +5 } },
      { text: "Buscar apoyo en otras áreas", next: "campaña1", miniGame: "campaña", effect: { poblacion: +5 } }
    ]
  },
  campaña1: {
    text: "Lanzas una campaña mediática vibrante que conquista al pueblo. Las calles se llenan de fervor.",
    choices: [
      { text: "Aprovecha el momento para cambiar el curso", next: "final_exito", effect: { poblacion: +15 } },
      { text: "El riesgo de sobreexposición es alto", next: "final_fracaso", effect: { poblacion: -10 } }
    ]
  },
  regreso: {
    text: "Decides retroceder y reorganizar tus ideas. La situación se estabiliza, pero la oportunidad se desvanece.",
    choices: [] // Nodo terminal
  },
  final_exito: {
    text: "Tu estrategia ha funcionado. Has conseguido boicotear la comisión y cambiar la narrativa del país. La revolución está en marcha.",
    choices: [] // Final feliz
  },
  final_mitad: {
    text: "Aunque no alcanzaste todos tus objetivos, lograste debilitar al establecimiento. El futuro es incierto, pero se han abierto nuevas posibilidades.",
    choices: [] // Final intermedio
  },
  final_fracaso: {
    text: "La campaña no logra conectar y la presión se vuelve insoportable. El escándalo se intensifica y el país se sumerge en el caos.",
    choices: [] // Final negativo
  }
};
  
/**
 * Sistema de Facciones.
 * Cada acción puede modificar estos valores.
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
 * Desbloquea y guarda logros alcanzados durante el juego.
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

