export default class SutilScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SutilScene' });
  }
  
  create() {
    // Fondo
    this.add.image(600, 400, 'congress_bg');
    
    // Recuperar la estrategia seleccionada
    this.strategy = this.registry.get('strategy');
    
    // Instrucciones según estrategia
    if (this.strategy === 'influencia') {
      this.add.text(600, 50, 'Influencia Sutil: Manipula los medios', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
      this.add.text(600, 100, 'Conecta las ideas presionando la tecla "I" en el momento adecuado', { fontSize: '20px', fill: '#fff' }).setOrigin(0.5);
    } else if (this.strategy === 'campaña') {
      this.add.text(600, 50, 'Campaña Medial: Gana apoyo popular', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
      this.add.text(600, 100, 'Sigue el ritmo y presiona la tecla "C" en sincronía', { fontSize: '20px', fill: '#fff' }).setOrigin(0.5);
    }
    
    // Reto con cuenta regresiva (10 segundos)
    this.challengeTime = 10;
    this.timerText = this.add.text(600, 150, `Tiempo: ${this.challengeTime}`, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
    
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.challengeTime--;
        this.timerText.setText(`Tiempo: ${this.challengeTime}`);
        if (this.challengeTime <= 0) {
          this.sound.play('failure');
          this.scene.start('EndScene', { result: 'failure', strategy: this.strategy });
        }
      },
      callbackScope: this,
      loop: true
    });
    
    // Escuchar entrada del teclado según estrategia
    this.input.keyboard.on('keydown', (event) => {
      if (this.strategy === 'influencia' && (event.key === 'I' || event.key === 'i')) {
        this.sound.play('debate');
        this.scene.start('EndScene', { result: 'success', strategy: this.strategy });
      } else if (this.strategy === 'campaña' && (event.key === 'C' || event.key === 'c')) {
        this.sound.play('debate');
        this.scene.start('EndScene', { result: 'success', strategy: this.strategy });
      }
    });
    
    // Botón de retroceso
    let backButton = this.add.text(50, 750, 'Atrás', { fontSize: '24px', fill: '#fff' })
      .setInteractive({ useHandCursor: true });
    backButton.on('pointerdown', () => {
      this.sound.play('click');
      this.scene.start('DecisionScene');
    });
  }
}
