export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }
  
  create() {
    // Fondo de menú
    this.add.image(600, 400, 'menu_bg');
    
    // Título y subtítulo
    let title = this.add.text(600, 100, 'Cripto Revolución\nLa Jugada de Milei', { fontSize: '36px', fill: '#ffdd00', align: 'center' });
    title.setOrigin(0.5);
    
    let instructions = this.add.text(600, 200, 'Boicotea la comisión investigadora y evade el escándalo cripto', { fontSize: '20px', fill: '#fff', align: 'center', wordWrap: { width: 800 } });
    instructions.setOrigin(0.5);

    // Botón de inicio con efecto hover
    let startButton = this.add.text(600, 400, 'Iniciar Juego', { fontSize: '28px', fill: '#0f0' })
      .setInteractive({ useHandCursor: true });
    startButton.setOrigin(0.5);
    
    startButton.on('pointerover', () => {
      startButton.setStyle({ fill: '#ff0' });
    });
    startButton.on('pointerout', () => {
      startButton.setStyle({ fill: '#0f0' });
    });
    startButton.on('pointerdown', () => {
      this.sound.play('click');
      this.scene.start('DecisionScene');
    });
    
    // Botón de créditos
    let creditsButton = this.add.text(600, 500, 'Créditos', { fontSize: '24px', fill: '#fff' })
      .setInteractive({ useHandCursor: true });
    creditsButton.setOrigin(0.5);
    creditsButton.on('pointerdown', () => {
      alert("Cripto Revolución - La Jugada de Milei\nDesarrollado por [Tu Nombre]\nInspirado en el escenario político actual.");
    });
  }
}

