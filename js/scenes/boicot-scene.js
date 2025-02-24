export default class BoicotScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BoicotScene' });
  }
  create() {
    this.add.image(600, 400, 'congress_bg');
    this.add.text(600, 50, 'Ejecuta el Boicot', { fontSize: '28px', fill: '#fff' }).setOrigin(0.5);
    
    // Sprite representativo (por ejemplo, Milei, que simboliza la acción de boicot)
    const target = this.add.sprite(600, 400, 'milei').setInteractive();
    target.on('pointerdown', () => {
      this.sound.play('click');
      // Simulación de acción: reduciendo la visibilidad del sprite para representar "destrucción"
      target.alpha -= 0.1;
      // Cuando el sprite se ha "desgastado" lo suficiente, se considera éxito.
      if (target.alpha <= 0.2) {
        this.sound.play('success');
        this.scene.start('EndScene', { result: 'success', strategy: 'boicot' });
      }
    });
  }
}
