export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }
  
  create() {
    const camWidth = this.cameras.main.width;
    const camHeight = this.cameras.main.height;
    
    const bg = this.add.image(camWidth / 2, camHeight / 2, 'menu_bg');
    bg.setDisplaySize(camWidth, camHeight);
    this.add.rectangle(camWidth / 2, camHeight / 2, camWidth, camHeight, 0x000000, 0.3);
    
    const title = this.add.text(camWidth / 2, 100, 'Milei el gran soborno', {
      fontSize: '48px',
      fill: '#ffdd00',
      align: 'center'
    }).setOrigin(0.5).setShadow(2, 2, "#000", 2, true, true);
    
    const instructions = this.add.text(camWidth / 2, 200, 
      'Compra la lealtad de diputados y senadores o asigna jueces para evitar la investigación del escándalo cripto.',
      { fontSize: '28px', fill: '#fff', align: 'center', wordWrap: { width: camWidth - 100 } }
    ).setOrigin(0.5).setShadow(2, 2, "#000", 2, true, true);
    
    const startButton = this.add.text(camWidth / 2, 400, 'Iniciar Juego', {
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
    
    const creditsButton = this.add.text(camWidth / 2, 500, 'Créditos', { fontSize: '32px', fill: '#fff' })
      .setInteractive({ useHandCursor: true })
      .setOrigin(0.5)
      .setStyle({ padding: '8px 16px', backgroundColor: '#222' });
    
    creditsButton.on('pointerdown', () => {
      alert("Milei el gran soborno\nDesarrollado por Ramiro Silvera\nInspirado en la corrupción del presidente Javier Milei y la nefasta oposición.");
    });
  }
}
