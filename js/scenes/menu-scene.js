export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }
  
  create() {
    // Fondo con overlay para legibilidad
    this.add.image(600, 400, 'menu_bg');
    this.add.rectangle(600, 400, 1200, 800, 0x000000, 0.3);
    
    const title = this.add.text(600, 100, 'Cripto Revolución\nLa Jugada de Milei', {
      fontSize: '48px',
      fill: '#ffdd00',
      align: 'center'
    }).setOrigin(0.5).setShadow(2, 2, "#000", 2, true, true);
    
    const instructions = this.add.text(600, 200, 
      'Toma decisiones estratégicas, enfrenta desafiantes minijuegos y cambia el destino del país.', {
      fontSize: '28px',
      fill: '#fff',
      align: 'center',
      wordWrap: { width: 1000 }
    }).setOrigin(0.5).setShadow(2, 2, "#000", 2, true, true);
    
    const startButton = this.add.text(600, 400, 'Iniciar Juego', {
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
    
    const creditsButton = this.add.text(600, 500, 'Créditos', { fontSize: '28px', fill: '#fff' })
      .setInteractive({ useHandCursor: true })
      .setOrigin(0.5)
      .setStyle({ padding: '8px 16px', backgroundColor: '#222' });
    
    creditsButton.on('pointerdown', () => {
      alert("Cripto Revolución - La Jugada de Milei\nDesarrollado por [Tu Nombre]\nInspirado en el escenario político actual.");
    });
  }
}

