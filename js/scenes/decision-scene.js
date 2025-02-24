export default class DecisionScene extends Phaser.Scene {
  constructor() {
    super({ key: 'DecisionScene' });
  }
  create() {
    this.add.text(600, 50, 'Selecciona tu estrategia', { fontSize: '28px', fill: '#fff' }).setOrigin(0.5);
    
    // Botón para estrategia de BOICOT
    const boicotButton = this.add.image(400, 300, 'boicot_icon').setInteractive();
    // Botón para estrategia de INFLUENCIA (usando vote_icon)
    const influenciaButton = this.add.image(600, 300, 'vote_icon').setInteractive();
    // Botón para estrategia de CAMPAÑA (usando debate_icon)
    const campañaButton = this.add.image(800, 300, 'debate_icon').setInteractive();
    
    boicotButton.on('pointerdown', () => {
      this.sound.play('boicot');
      // Se asigna la estrategia en el registry para su uso posterior.
      this.registry.set('strategy', 'boicot');
      // Se puede actualizar la lógica de facciones (ej.: -Establecimiento)
      this.scene.start('BoicotScene');
    });
    
    influenciaButton.on('pointerdown', () => {
      this.sound.play('click');
      this.registry.set('strategy', 'influencia');
      this.scene.start('SutilScene');
    });
    
    campañaButton.on('pointerdown', () => {
      this.sound.play('click');
      this.registry.set('strategy', 'campaña');
      this.scene.start('SutilScene');
    });
  }
}
