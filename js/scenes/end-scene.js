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
    const bg = this.add.image(camWidth / 2, camHeight / 2, bgKey);
    bg.setDisplaySize(camWidth, camHeight);
    bg.setAlpha(0);
    this.tweens.add({
      targets: bg,
      alpha: { from: 0, to: 1 },
      duration: 500
    });
    
    // Capa oscurecedora para mejorar la legibilidad
    this.add.rectangle(camWidth / 2, camHeight / 2, camWidth, camHeight, 0x000000, 0.3);
    
    // Título
    const title = "FIN DEL JUEGO";
    this.add.text(camWidth / 2, 60, title, {
      fontFamily: 'Arial',
      fontSize: '48px',
      color: '#00ff00',
      align: 'center',
      stroke: '#000',
      strokeThickness: 6,
      wordWrap: { width: camWidth - 100 }
    }).setOrigin(0.5);
    
    // Panel para el mensaje final
    const finalPanelWidth = camWidth - 100;
    const finalPanelHeight = 200;
    const finalPanelY = 120;
    const panelBg = this.add.rectangle(camWidth / 2, finalPanelY + finalPanelHeight / 2, finalPanelWidth, finalPanelHeight, 0x000000, 0.6);
    panelBg.setStrokeStyle(2, 0xffffff);
    
    this.add.text(camWidth / 2, finalPanelY + finalPanelHeight / 2, this.finalText, {
      fontFamily: 'Arial',
      fontSize: '32px',
      color: '#ffffff',
      align: 'center',
      wordWrap: { width: finalPanelWidth - 20 }
    }).setOrigin(0.5);
    
    // Panel para mostrar el estado del sistema de facciones
    const status = this.factionSystem.getStatus();
    const statusString = `Establecimiento: ${status.establishment} | Medios: ${status.medios} | Apoyo Popular: ${status.poblacion} | Libertarios: ${status.libertarios}`;
    const statusPanelY = finalPanelY + finalPanelHeight + 30;
    const statusPanelWidth = camWidth - 100;
    const statusPanelHeight = 60;
    const statusPanelBg = this.add.rectangle(camWidth / 2, statusPanelY + statusPanelHeight / 2, statusPanelWidth, statusPanelHeight, 0x000000, 0.6);
    statusPanelBg.setStrokeStyle(2, 0xffffff);
    
    this.add.text(camWidth / 2, statusPanelY + statusPanelHeight / 2, statusString, {
      fontFamily: 'Arial',
      fontSize: '28px',
      color: '#ffdd00',
      align: 'center',
      wordWrap: { width: statusPanelWidth - 20 }
    }).setOrigin(0.5);
    
    // Botón de volver al menú
    const menuButton = this.add.text(camWidth / 2, camHeight - 80, 'Volver al Menú', {
      fontFamily: 'Arial',
      fontSize: '32px',
      color: '#ffffff',
      align: 'center',
      padding: { x: 20, y: 10 },
      backgroundColor: '#222'
    })
      .setInteractive({ useHandCursor: true })
      .setOrigin(0.5)
      .setStroke('#ffffff', 2);
    
    menuButton.on('pointerdown', () => {
      this.sound.play('click');
      this.scene.start('MenuScene');
    });
    
    // Desbloqueo de logros (como ejemplo)
    const achievements = new AchievementSystem();
    if (status.medios >= 80) {
      achievements.unlock('Maestro de los Medios');
      this.showAchievementPopup('Logro Desbloqueado: Maestro de los Medios');
    }
  }
  
  showAchievementPopup(message) {
    const camWidth = this.cameras.main.width;
    const popup = this.add.text(camWidth / 2, this.cameras.main.centerY, message, {
      fontFamily: 'Arial',
      fontSize: '32px',
      color: '#ff0',
      backgroundColor: '#000',
      padding: { x: 10, y: 10 },
      align: 'center',
      wordWrap: { width: camWidth - 100 }
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
