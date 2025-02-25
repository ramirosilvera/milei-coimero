/**
 * Árbol Narrativo para Cripto Revolución.
 * Cada nodo contiene:
 * - text: Narrativa del nodo.
 * - choices: Opciones disponibles; cada opción incluye:
 *    • text: Texto de la opción.
 *    • next: id del siguiente nodo.
 *    • miniGame: (opcional) tipo de minijuego ("boicot", "influencia" o "campaña").
 *    • effect: Objeto con cambios en facciones (ej. { establishment: -10, medios: +5 }).
 */
export const narrativeTree = {
  start: {
    text: "La nación está al borde del colapso. Milei, inmerso en un escándalo cripto, debe actuar para evitar una investigación que podría derrumbar al establecimiento. ¿Qué camino tomarás?",
    choices: [
      { text: "Lanzar un boicot radical", next: "boicot1", miniGame: "boicot", effect: { establishment: -10 } },
      { text: "Manipular a los medios", next: "influencia1", miniGame: "influencia", effect: { medios: +10 } },
      { text: "Organizar una campaña ciudadana", next: "campana1", miniGame: "campaña", effect: { poblacion: +10 } }
    ]
  },
  boicot1: {
    text: "Decides atacar de manera directa el sistema. El ambiente se llena de tensión y protestas. ¿Te arriesgas a intensificar el ataque o reconsideras tu estrategia?",
    choices: [
      { text: "Intensificar el ataque", next: "boicot2", miniGame: "boicot", effect: { establishment: -15 } },
      { text: "Replantear la estrategia", next: "regreso", effect: { establishment: +5 } }
    ]
  },
  influencia1: {
    text: "Con tus contactos en los medios, comienzas a difundir información que pone en duda la veracidad de la investigación. La opinión pública empieza a cambiar. ¿Deseas amplificar el mensaje o diversificar tus tácticas?",
    choices: [
      { text: "Amplificar el mensaje", next: "influencia2", miniGame: "influencia", effect: { medios: +15 } },
      { text: "Diversificar con una campaña", next: "campana1", miniGame: "campaña", effect: { poblacion: +5 } }
    ]
  },
  campana1: {
    text: "Lanzas una campaña ciudadana que busca unir a la población contra el sistema. Las redes se llenan de mensajes de esperanza y protesta. ¿Aprovechas el momento o ajustas la estrategia?",
    choices: [
      { text: "Aprovechar el momento", next: "final_exito", miniGame: "campaña", effect: { poblacion: +15 } },
      { text: "Ajustar la estrategia", next: "final_mitad", effect: { poblacion: -5 } }
    ]
  },
  boicot2: {
    text: "El ataque se intensifica, y logras debilitar notablemente al establecimiento. Sin embargo, la presión aumenta y el riesgo se multiplica.",
    choices: [
      { text: "Arriesgarlo todo", next: "final_exito", effect: { libertarios: +10, establishment: -20 } },
      { text: "Retroceder para reagruparse", next: "final_mitad", effect: { establishment: -5 } }
    ]
  },
  influencia2: {
    text: "La manipulación de los medios se afianza y la narrativa comienza a girar a tu favor. ¿Consolidar este control o buscar alianzas en otros sectores?",
    choices: [
      { text: "Consolidar control", next: "final_exito", effect: { medios: +10, poblacion: +5 } },
      { text: "Buscar nuevas alianzas", next: "campana1", miniGame: "campaña", effect: { poblacion: +5 } }
    ]
  },
  regreso: {
    text: "Decides replantear la estrategia y te retiras momentáneamente. Aunque la situación se estabiliza, se pierde parte de la oportunidad.",
    choices: []
  },
  final_exito: {
    text: "Tu estrategia ha sido un éxito rotundo. Has logrado boicotear la comisión y cambiar el rumbo del país. Una nueva era se abre ante ti.",
    choices: []
  },
  final_mitad: {
    text: "Aunque no alcanzaste todos tus objetivos, lograste debilitar al establecimiento. El futuro es incierto, pero se han abierto nuevas posibilidades.",
    choices: []
  },
  final_fracaso: {
    text: "La campaña fracasa y la presión se vuelve insoportable. El escándalo se intensifica y la nación cae en el caos.",
    choices: []
  }
};
  
/**
 * Sistema de Facciones.
 * Permite llevar un seguimiento de cómo afectan tus decisiones a distintos poderes.
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
 * Desbloquea y almacena logros durante la partida.
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


