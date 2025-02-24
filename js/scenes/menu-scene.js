export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }
  
  create() {
    // Fondo del menú
    this.add.image(600, 400, 'menu_bg');
    
    const title = this.add.text(600, 100, 'Cripto Revolución\nLa Jugada de Milei', {
      fontSize: '36px', fill: '#ffdd00', align: 'center'
    }).setOrigin(0.5);
    
    const instructions = this.add.text(600, 200, 
      'Elige tu estrategia para enfrentar el escándalo cripto y boicotear a la comisión investigadora.', {
      fontSize: '20px', fill: '#fff', align: 'center', wordWrap: { width: 800 }
    }).setOrigin(0.5);

    // Botón de inicio con efectos de hover
    const startButton = this.add.text(600, 400, 'Iniciar Juego', {
      fontSize: '28px', fill: '#0f0'
    })
      .setInteractive({ useHandCursor: true })
      .setOrigin(0.5);
      
    startButton.on('pointerover', () => startButton.setStyle({ fill: '#ff0' }));
    startButton.on('pointerout', () => startButton.setStyle({ fill: '#0f0' }));
    startButton.on('pointerdown', () => {
      this.sound.play('click');
      this.scene.start('DecisionScene');
    });
    
    // Botón de créditos
    const creditsButton = this.add.text(600, 500, 'Créditos', {
      fontSize: '24px', fill: '#fff'
    })
      .setInteractive({ useHandCursor: true })
      .setOrigin(0.5);
    creditsButton.on('pointerdown', () => {
      alert("Cripto Revolución - La Jugada de Milei\nDesarrollado por [Tu Nombre]\nInspirado en el escenario político actual.");
    });
  }
}
