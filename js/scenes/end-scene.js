import { AchievementSystem } from '../narrative-manager.js';

export default class EndScene extends Phaser.Scene {
  constructor() {
    super({ key: 'EndScene' });
  }
  
  init(data) {
    this.result = data.result;
    this.strategy = data.strategy;
  }
  
  create() {
    // Fondo y efecto de fade in
    const bgKey = this.result === 'success' ? 'success_bg' : 'failure_bg';
    this.add.image(600, 400, bgKey).setAlpha(0);
    this.tweens.add({
      targets: this.cameras.main,
      alpha: { from: 0, to: 1 },
      duration: 500
    });
    
    // Título del resultado
    const titleText = this.result === 'success' ? '¡Misión Cumplida!' : 'Fracaso en la Misión';
    this.add.text(600, 400, titleText, { fontSize: '40px', fill: this.result === 'success' ? '#0f0' : '#f00' }).setOrigin(0.5);
    
    // Narrativa dinámica según estrategia
    let narrativeText = '';
    if (this.strategy === 'boicot') {
      narrativeText = this.result === 'success' ? 
        'El boicot ha debilitado al establecimiento, permitiéndote evadir la investigación.' :
        'El sistema se mantiene firme y la comisión investiga sin cesar.';
    } else if (this.strategy === 'influencia') {
      narrativeText = this.result === 'success' ? 
        'Has manipulado la narrativa mediática a tu favor, desviando la atención.' :
        'Los medios han visto a través de la manipulación y la verdad sale a la luz.';
    } else if (this.strategy === 'campaña') {
      narrativeText = this.result === 'success' ? 
        'La campaña ha ganado el apoyo popular, asegurando tu posición.' :
        'La campaña no logró conectar con la gente, y la presión aumenta.';
    }
    
    this.add.text(600, 500, narrativeText, {
      fontSize: '24px',
      fill: '#fff',
      align: 'center',
      wordWrap: { width: 1000 }
    }).setOrigin(0.5);
    
    // Mostrar popup de logro (simulado)
    const achievements = new AchievementSystem();
    // Ejemplo: si completaste exitosamente un boicot, desbloquea un logro
    if (this.strategy === 'boicot' && this.result === 'success') {
      achievements.unlock('Revolucionario');
      this.showAchievementPopup('Logro Desbloqueado: Revolucionario');
    }
    
    // Botón para volver al menú
    const menuButton = this.add.text(600, 700, 'Volver al Menú', { fontSize: '28px', fill: '#fff' })
      .setInteractive({ useHandCursor: true })
      .setOrigin(0.5);
    menuButton.on('pointerdown', () => {
      this.sound.play('click');
      this.scene.start('MenuScene');
    });
  }
  
  showAchievementPopup(message) {
    const popup = this.add.text(600, 350, message, {
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
