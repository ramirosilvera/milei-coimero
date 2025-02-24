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
      this.add.text(600, 400, '¡Misión Cumplida!', { fontSize: '32px', fill: '#0f0' }).setOrigin(0.5);
      this.sound.play('success');
    } else {
      this.add.image(600, 400, 'failure_bg');
      this.add.text(600, 400, 'Fracaso en la Misión', { fontSize: '32px', fill: '#f00' }).setOrigin(0.5);
      this.sound.play('failure');
    }
    
    const menuButton = this.add.text(600, 700, 'Volver al Menú', { fontSize: '24px', fill: '#fff' })
      .setInteractive()
      .on('pointerdown', () => {
        this.sound.play('click');
        this.scene.start('MenuScene');
      });
    menuButton.setOrigin(0.5);
  }
}

