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
    this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, bgKey)
      .setDisplaySize(this.cameras.main.width, this.cameras.main.height)
      .setAlpha(0);
    this.tweens.add({
      targets: this.cameras.main,
      alpha: { from: 0, to: 1 },
      duration: 500
    });
    
    const titleText = "Fin de la Partida";
    this.add.text(this.cameras.main.centerX, 100, titleText, { fontSize: '48px', fill: '#0f0' })
      .setOrigin(0.5).setShadow(2,2,"#000",2,true,true);
    this.add.text(this.cameras.main.centerX, 200, this.finalText, { fontSize: '32px', fill: '#fff', align: 'center', wordWrap: { width: this.cameras.main.width - 100 } })
      .setOrigin(0.5).setShadow(2,2,"#000",2,true,true);
    
    const status = this.factionSystem.getStatus();
    const statusText = `Establecimiento: ${status.establishment} | Medios: ${status.medios} | Apoyo Popular: ${status.poblacion} | Libertarios: ${status.libertarios}`;
    this.add.text(this.cameras.main.centerX, 350, statusText, { fontSize: '28px', fill: '#ffdd00', align: 'center' })
      .setOrigin(0.5).setShadow(2,2,"#000",2,true,true);
    
    const achievements = new AchievementSystem();
    if (status.medios >= 80) {
      achievements.unlock('Maestro de los Medios');
      this.showAchievementPopup('Logro Desbloqueado: Maestro de los Medios');
    }
    
    const menuButton = this.add.text(this.cameras.main.centerX, 700, 'Volver al Menú', { fontSize: '32px', fill: '#fff' })
      .setInteractive({ useHandCursor: true })
      .setOrigin(0.5)
      .setStyle({ padding: '10px 20px', backgroundColor: '#222' });
    menuButton.on('pointerdown', () => {
      this.sound.play('click');
      this.scene.start('MenuScene');
    });
  }
  
  showAchievementPopup(message) {
    const popup = this.add.text(this.cameras.main.centerX, 500, message, {
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
