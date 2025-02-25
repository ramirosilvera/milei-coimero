export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }
  
  create() {
    // Fondo con overlay para legibilidad y responsividad
    this.add.image(600, 400, 'menu_bg').setDisplaySize(this.cameras.main.width, this.cameras.main.height);
    this.add.rectangle(this.cameras.main.centerX, this.cameras.main.centerY, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.3);
    
    const title = this.add.text(this.cameras.main.centerX, 100, 'Cripto Revolución\nLa Jugada de Milei', {
      fontSize: '48px',
      fill: '#ffdd00',
      align: 'center'
    }).setOrigin(0.5).setShadow(2, 2, "#000", 2, true, true);
    
    const instructions = this.add.text(this.cameras.main.centerX, 200, 
      'Compra la lealtad de diputados y senadores para evitar que se vote la comisión investigadora del escándalo cripto.', {
      fontSize: '28px',
      fill: '#fff',
      align: 'center',
      wordWrap: { width: this.cameras.main.width - 100 }
    }).setOrigin(0.5).setShadow(2, 2, "#000", 2, true, true);
    
    const startButton = this.add.text(this.cameras.main.centerX, 400, 'Iniciar Juego', {
      fontSize: '32px',
      fill: '#0f0'
    })
      .setInteractive({ useHandCursor: true })
      .setOrigin(0.5)
      .setStyle({ padding: '10px 20px', backgroundColor: '#222' });
    
    startButton.on('pointerover', () => startButton.setStyle({ fill: '#ff0' }));
    startButton.on('pointerout', () => startButton.setStyle({ fill: '#0f0' }));
    startButton.on('pointerdown', () => {
      this.sound.play('click');
      this.scene.start('NarrativeScene', { currentNode: "start" });
    });
    
    const creditsButton = this.add.text(this.cameras.main.centerX, 500, 'Créditos', { fontSize: '32px', fill: '#fff' })
      .setInteractive({ useHandCursor: true })
      .setOrigin(0.5)
      .setStyle({ padding: '8px 16px', backgroundColor: '#222' });
    
    creditsButton.on('pointerdown', () => {
      alert("Cripto Revolución – La Jugada de Milei\nDesarrollado por [Tu Nombre]\nInspirado en la política actual.");
    });
  }
}
