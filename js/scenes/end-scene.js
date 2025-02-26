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
    
    // Seleccionar fondo según el resultado
    let bgKey = "success_bg";
    if (this.finalText.toLowerCase().indexOf("fracaso") !== -1) {
      bgKey = "failure_bg";
    }
    // Fondo de la escena
    const bg = this.add.image(camWidth / 2, camHeight / 2, bgKey);
    bg.setDisplaySize(camWidth, camHeight);
    bg.setAlpha(0);
    this.tweens.add({
      targets: bg,
      alpha: { from: 0, to: 1 },
      duration: 500
    });
    
    // Overlay para mejorar la legibilidad
    this.add.rectangle(camWidth / 2, camHeight / 2, camWidth, camHeight, 0x000000, 0.3);
    
    // Título
    const titleText = "Fin de la Partida";
    this.add.text(camWidth / 2, 80, titleText, {
      fontSize: '48px',
      fill: '#0f0',
      align: 'center',
      wordWrap: { width: camWidth - 50 }
    }).setOrigin(0.5).setShadow(2, 2, "#000", 2, true, true);
    
    // Texto final (narrativa)
    this.add.text(camWidth / 2, 160, this.finalText, {
      fontSize: '32px',
      fill: '#fff',
      align: 'center',
      wordWrap: { width: camWidth - 50 }
    }).setOrigin(0.5).setShadow(2, 2, "#000", 2, true, true);
    
    // Estado final de las facciones
    const status = this.factionSystem.getStatus();
    const statusText = `Establecimiento: ${status.establishment} | Medios: ${status.medios} | Apoyo Popular: ${status.poblacion} | Libertarios: ${status.libertarios}`;
    this.add.text(camWidth / 2, 250, statusText, {
      fontSize: '28px',
      fill: '#ffdd00',
      align: 'center',
      wordWrap: { width: camWidth - 50 }
    }).setOrigin(0.5).setShadow(2, 2, "#000", 2, true, true);
    
    // Mostrar logro si corresponde
    const achievements = new AchievementSystem();
    if (status.medios >= 80) {
      achievements.unlock('Maestro de los Medios');
      this.showAchievementPopup('Logro Desbloqueado: Maestro de los Medios');
    }
    
    // Botón para volver al menú principal
    const menuButton = this.add.text(camWidth / 2, camHeight - 80, 'Volver al Menú', {
      fontSize: '32px',
      fill: '#fff',
      align: 'center'
    })
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
    const popup = this.add.text(camWidth / 2, this.cameras.main.centerY, message, {
      fontSize: '32px',
      fill: '#ff0',
      backgroundColor: '#000',
      padding: { x: 10, y: 10 },
      align: 'center',
      wordWrap: { width: camWidth - 50 }
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
