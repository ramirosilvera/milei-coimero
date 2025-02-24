export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }
  create() {
    this.add.image(600, 400, 'menu_bg');
    const title = this.add.text(600, 100, 'Cripto Revolución - La Jugada de Milei', { fontSize: '32px', fill: '#fff' });
    title.setOrigin(0.5);
    
    const startButton = this.add.text(600, 400, 'Iniciar Juego', { fontSize: '24px', fill: '#0f0' })
      .setInteractive()
      .on('pointerdown', () => {
        this.sound.play('click');
        this.scene.start('DecisionScene');
      });
    startButton.setOrigin(0.5);
  }
}

