export default class SutilScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SutilScene' });
  }
  
  create() {
    this.add.image(600, 400, 'congress_bg');
    this.strategy = this.registry.get('strategy');
    
    // Selección aleatoria de tecla requerida según estrategia
    if (this.strategy === 'influencia') {
      this.requiredKeys = ['I', 'U'];
      this.add.text(600, 50, 'Influencia Sutil: Manipula los medios', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
      this.add.text(600, 100, 'Presiona la tecla indicada cuando aparezca en pantalla', { fontSize: '20px', fill: '#fff' }).setOrigin(0.5);
    } else if (this.strategy === 'campaña') {
      this.requiredKeys = ['C', 'V'];
      this.add.text(600, 50, 'Campaña Medial: Gana apoyo popular', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
      this.add.text(600, 100, 'Presiona la tecla indicada en sincronía con el ritmo', { fontSize: '20px', fill: '#fff' }).setOrigin(0.5);
    }
    
    // Selecciona aleatoriamente la tecla a presionar y muéstrala
    this.currentKey = Phaser.Utils.Array.GetRandom(this.requiredKeys);
    this.keyText = this.add.text(600, 200, `Presiona: ${this.currentKey}`, { fontSize: '48px', fill: '#ff0' }).setOrigin(0.5);
    
    // Reto con cuenta regresiva (10 segundos)
    this.challengeTime = 10;
    this.timerText = this.add.text(600, 250, `Tiempo: ${this.challengeTime}`, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
    
    this.timeEvent = this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.challengeTime--;
        this.timerText.setText(`Tiempo: ${this.challengeTime}`);
        if (this.challengeTime <= 0) {
          this.sound.play('failure');
          this.scene.start('EndScene', { result: 'failure', strategy: this.strategy });
        }
      },
      loop: true
    });
    
    // Escucha de entrada del teclado
    this.input.keyboard.on('keydown', (event) => {
      if (event.key.toUpperCase() === this.currentKey) {
        this.sound.play('debate');
        // Efecto visual de acierto
        this.tweens.add({
          targets: this.keyText,
          scale: 1.5,
          duration: 200,
          yoyo: true
        });
        // Cancelar el timer y avanzar al final
        this.timeEvent.remove();
        this.scene.start('EndScene', { result: 'success', strategy: this.strategy });
      }
    });
    
    // Botón de retroceso
    const backButton = this.add.text(50, 750, 'Atrás', { fontSize: '24px', fill: '#fff' })
      .setInteractive({ useHandCursor: true });
    backButton.on('pointerdown', () => {
      this.sound.play('click');
      this.scene.start('DecisionScene');
    });
  }
}
