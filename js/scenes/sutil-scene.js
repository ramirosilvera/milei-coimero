export default class SutilScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SutilScene' });
  }
  create() {
    this.add.image(600, 400, 'congress_bg');
    this.add.text(600, 50, 'Mini Juego de Estrategia', { fontSize: '28px', fill: '#fff' }).setOrigin(0.5);
    
    // Simulación de un mini-juego: al presionar la tecla "A" se logra el objetivo.
    this.input.keyboard.on('keydown', (event) => {
      if (event.key === 'a' || event.key === 'A') {
        this.sound.play('debate');
        this.scene.start('EndScene', { 
          result: 'success', 
          strategy: this.registry.get('strategy')
        });
      }
    });
  }
}
