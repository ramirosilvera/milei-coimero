import { AchievementSystem } from '../narrative-manager.js';

export default class EndScene extends Phaser.Scene {
  constructor() {
    super({ key: 'EndScene' });
  }
  
  init(data) {
    this.factionSystem = data.factionSystem;
    this.finalText = data.finalText;
  }
  
  create() {
    const bgKey = 'success_bg';
    this.add.image(600, 400, bgKey).setAlpha(0);
    this.tweens.add({
      targets: this.cameras.main,
      alpha: { from: 0, to: 1 },
      duration: 500
    });
    
    const titleText = "Fin de la Partida";
    this.add.text(600, 100, titleText, { fontSize: '40px', fill: '#0f0' }).setOrigin(0.5);
    this.add.text(600, 200, this.finalText, { fontSize: '28px', fill: '#fff', align: 'center', wordWrap: { width: 1000 } }).setOrigin(0.5);
    
    const status = this.factionSystem.getStatus();
    const statusText = `Establecimiento: ${status.establishment} | Medios: ${status.medios} | Apoyo Popular: ${status.poblacion} | Libertarios: ${status.libertarios}`;
    this.add.text(600, 350, statusText, { fontSize: '24px', fill: '#ffdd00', align: 'center' }).setOrigin(0.5);
    
    const achievements = new AchievementSystem();
    if (status.medios >= 80) {
      achievements.unlock('Maestro de los Medios');
      this.showAchievementPopup('Logro Desbloqueado: Maestro de los Medios');
    }
    
    const menuButton = this.add.text(600, 700, 'Volver al Menú', { fontSize: '28px', fill: '#fff' })
      .setInteractive({ useHandCursor: true })
      .setOrigin(0.5);
    menuButton.on('pointerdown', () => {
      this.sound.play('click');
      this.scene.start('MenuScene');
    });
  }
  
  showAchievementPopup(message) {
    const popup = this.add.text(600, 500, message, {
      fontSize: '28px',
      fill: '#ff0',
      backgroundColor: '#000',
      padding: { x: 10, y: 10 }
    }).setOrigin(0.5).setAlpha(0);
    
    this.tweens.add({
      targets: popup,
      alpha: { from: 0, to: 1 },
      duration: 500,
      yoyo: true,
      hold: 1000,
      onComplete: () => popup.destroy()
    });
  }
}
