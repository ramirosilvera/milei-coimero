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
    const camWidth = this.cameras.main.width;
    const camHeight = this.cameras.main.height;
    // Seleccionar fondo de acuerdo al resultado: success_bg para éxito, failure_bg para fracaso.
    let bgKey = "success_bg";
    if (this.finalText.indexOf("fracaso") !== -1) {
      bgKey = "failure_bg";
    }
    const bg = this.add.image(camWidth / 2, camHeight / 2, bgKey);
    bg.setDisplaySize(camWidth, camHeight);
    bg.setAlpha(0);
    this.tweens.add({
      targets: this.cameras.main,
      alpha: { from: 0, to: 1 },
      duration: 500
    });
    
    const titleText = "Fin de la Partida";
    this.add.text(camWidth / 2, 100, titleText, { fontSize: '48px', fill: '#0f0' })
      .setOrigin(0.5).setShadow(2, 2, "#000", 2, true, true);
    this.add.text(camWidth / 2, 200, this.finalText, { fontSize: '32px', fill: '#fff', align: 'center', wordWrap: { width: camWidth - 100 } })
      .setOrigin(0.5).setShadow(2, 2, "#000", 2, true, true);
    
    const status = this.factionSystem.getStatus();
    const statusText = `Establecimiento: ${status.establishment} | Medios: ${status.medios} | Apoyo Popular: ${status.poblacion} | Libertarios: ${status.libertarios}`;
    this.add.text(camWidth / 2, 350, statusText, { fontSize: '28px', fill: '#ffdd00', align: 'center' })
      .setOrigin(0.5).setShadow(2, 2, "#000", 2, true, true);
    
    const achievements = new AchievementSystem();
    if (status.medios >= 80) {
      achievements.unlock('Maestro de los Medios');
      this.showAchievementPopup('Logro Desbloqueado: Maestro de los Medios');
    }
    
    const menuButton = this.add.text(camWidth / 2, 700, 'Volver al Menú', { fontSize: '32px', fill: '#fff' })
      .setInteractive({ useHandCursor: true })
      .setOrigin(0.5)
      .setStyle({ padding: '10px 20px', backgroundColor: '#222' });
    menuButton.on('pointerdown', () => {
      this.sound.play('click');
      this.scene.start('MenuScene');
    });
  }
  
  showAchievementPopup(message) {
    const camWidth = this.cameras.main.width;
    const popup = this.add.text(camWidth / 2, 500, message, {
      fontSize: '32px',
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
