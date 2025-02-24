export default class BoicotScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BoicotScene' });
  }
  
  create() {
    this.add.image(600, 400, 'congress_bg');
    this.add.text(600, 50, 'Ejecuta el Boicot Radical', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
    this.add.text(600, 100, 'Haz clic en Milei para debilitar el sistema. ¡Cuidado con los distractores!', { fontSize: '20px', fill: '#fff' }).setOrigin(0.5);
    
    // Sprite principal (objetivo)
    this.target = this.add.sprite(600, 400, 'milei')
      .setInteractive({ useHandCursor: true });
    this.target.alpha = 1;
    
    // Barra de progreso (100 = sistema intacto)
    this.progress = 100;
    this.progressBar = this.add.graphics();
    this.drawProgressBar();
    
    // Partículas para efecto de clic
    this.particles = this.add.particles('milei');
    this.emitter = this.particles.createEmitter({
      speed: { min: -100, max: 100 },
      scale: { start: 0.5, end: 0 },
      lifespan: 500,
      blendMode: 'ADD'
    });
    
    // Reducir progreso con clic en el objetivo (reducción variable)
    this.target.on('pointerdown', () => {
      this.sound.play('click');
      this.emitter.explode(10, this.target.x, this.target.y);
      let reduction = Phaser.Math.Between(8, 12);
      this.target.alpha -= 0.1;
      this.progress -= reduction;
      this.drawProgressBar();
      if (this.progress <= 0) {
        this.sound.play('success');
        this.scene.start('EndScene', { result: 'success', strategy: 'boicot' });
      }
    });
    
    // Distractores aleatorios (objetos falsos)
    this.time.addEvent({
      delay: 2000,
      callback: () => {
        const distractor = this.add.sprite(
          Phaser.Math.Between(100, 1100),
          Phaser.Math.Between(200, 600),
          'milei'
        ).setScale(0.5).setInteractive({ useHandCursor: true });
        distractor.alpha = 0.7;
        distractor.on('pointerdown', () => {
          // Penalización por hacer clic en distractor
          this.sound.play('failure');
          this.progress += 10;
          this.drawProgressBar();
          distractor.destroy();
        });
        // Que desaparezca en 3 segundos
        this.time.addEvent({ delay: 3000, callback: () => distractor.destroy() });
      },
      loop: true
    });
    
    // Botón de retroceso
    const backButton = this.add.text(50, 750, 'Atrás', { fontSize: '24px', fill: '#fff' })
      .setInteractive({ useHandCursor: true });
    backButton.on('pointerdown', () => {
      this.sound.play('click');
      this.scene.start('DecisionScene');
    });
  }
  
  drawProgressBar() {
    this.progressBar.clear();
    this.progressBar.fillStyle(0x222222, 0.8);
    this.progressBar.fillRect(400, 720, 400, 20);
    this.progressBar.fillStyle(0xff0000, 1);
    let barWidth = 400 * (this.progress / 100);
    this.progressBar.fillRect(400, 720, barWidth, 20);
  }
}
