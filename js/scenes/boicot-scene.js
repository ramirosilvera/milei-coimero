export default class BoicotScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BoicotScene' });
  }
  
  create() {
    // Fondo y título
    this.add.image(600, 400, 'congress_bg');
    this.add.text(600, 50, 'Ejecuta el Boicot Radical', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
    this.add.text(600, 100, 'Haz click rápidamente para destruir el sistema establecido', { fontSize: '20px', fill: '#fff' }).setOrigin(0.5);
    
    // Sprite representativo (por ejemplo, Milei simbolizando el ataque al sistema)
    this.target = this.add.sprite(600, 400, 'milei').setInteractive({ useHandCursor: true });
    this.target.alpha = 1;
    
    // Barra de progreso que representa la estabilidad del sistema (100 = sin daño)
    this.progress = 100;
    this.progressBar = this.add.graphics();
    this.drawProgressBar();
    
    // Al hacer click se reduce la estabilidad y se actualiza la barra
    this.target.on('pointerdown', () => {
      this.sound.play('click');
      this.target.alpha -= 0.1;
      this.progress -= 10;
      this.drawProgressBar();
      
      if (this.progress <= 0) {
        this.sound.play('success');
        this.scene.start('EndScene', { result: 'success', strategy: 'boicot' });
      }
    });
    
    // Botón para volver a la escena de decisiones
    let backButton = this.add.text(50, 750, 'Atrás', { fontSize: '24px', fill: '#fff' })
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
    let width = 400 * (this.progress / 100);
    this.progressBar.fillRect(400, 720, width, 20);
  }
}
