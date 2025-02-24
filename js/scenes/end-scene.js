export default class EndScene extends Phaser.Scene {
  constructor() {
    super({ key: 'EndScene' });
  }
  
  init(data) {
    this.result = data.result;
    this.strategy = data.strategy;
  }
  
  create() {
    if (this.result === 'success') {
      this.add.image(600, 400, 'success_bg');
      this.add.text(600, 400, '¡Misión Cumplida!', { fontSize: '40px', fill: '#0f0' }).setOrigin(0.5);
    } else {
      this.add.image(600, 400, 'failure_bg');
      this.add.text(600, 400, 'Fracaso en la Misión', { fontSize: '40px', fill: '#f00' }).setOrigin(0.5);
    }
    
    // Narrativa según estrategia y resultado
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
    
    this.add.text(600, 500, narrativeText, { fontSize: '24px', fill: '#fff', align: 'center', wordWrap: { width: 1000 } }).setOrigin(0.5);
    
    // Botón para volver al menú
    let menuButton = this.add.text(600, 700, 'Volver al Menú', { fontSize: '28px', fill: '#fff' })
      .setInteractive({ useHandCursor: true });
    menuButton.setOrigin(0.5);
    menuButton.on('pointerdown', () => {
      this.sound.play('click');
      this.scene.start('MenuScene');
    });
  }
}
