/**
 * Sistema de Facciones.
 * Controla el impacto de las decisiones en cada grupo.
 */
export class FactionSystem {
  constructor() {
    this.establishment = 50;  // Gobierno actual
    this.libertarios = 30;    // Bases políticas
    this.medios = 40;         // Control mediático
    this.poblacion = 60;      // Apoyo popular
  }
  
  updateFaction(faction, change) {
    if (this.hasOwnProperty(faction)) {
      this[faction] += change;
      this[faction] = Phaser.Math.Clamp(this[faction], 0, 100);
    }
  }
  
  getFactionStatus() {
    return {
      establishment: this.establishment,
      libertarios: this.libertarios,
      medios: this.medios,
      poblacion: this.poblacion
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
