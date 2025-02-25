export default class TutorialScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TutorialScene' });
  }
  
  create() {
    // Fondo y overlay para legibilidad
    this.add.image(600, 400, 'menu_bg').setAlpha(0.5);
    this.add.rectangle(600, 400, this.cameras.main.width, 300, 0x000000, 0.6);
    
    const tutorialText = [
      "Bienvenido a Cripto Revolución – La Jugada de Milei.",
      "Tu misión es evitar que se vote la comisión investigadora del escándalo cripto de Milei, comprando la lealtad de diputados y senadores corruptos.",
      "Podrás identificar a los políticos corruptos, ofrecerles cargos/favores o sobornarlos con dinero.",
      "Cada elección disparará un minijuego único con instrucciones en pantalla. ¡Atento a cada detalle!",
      "¡Tu éxito definirá el futuro del país!"
    ];
    
    let currentLine = 0;
    const textObj = this.add.text(600, 300, tutorialText[currentLine], {
      fontSize: '24px',
      fill: '#fff',
      align: 'center',
      wordWrap: { width: this.cameras.main.width - 100 }
    }).setOrigin(0.5);
    textObj.setShadow(2, 2, "#000", 2, true, true);
    
    const nextButton = this.add.text(600, 600, 'Siguiente', { fontSize: '28px', fill: '#0f0' })
      .setInteractive({ useHandCursor: true })
      .setOrigin(0.5)
      .setStyle({ padding: '10px', backgroundColor: '#222' });
    
    nextButton.on('pointerdown', () => {
      this.sound.play('click');
      currentLine++;
      if (currentLine < tutorialText.length) {
        textObj.setText(tutorialText[currentLine]);
      } else {
        this.cameras.main.fade(500, 0, 0, 0);
        this.cameras.main.on('camerafadeoutcomplete', () => {
          this.scene.start('MenuScene');
        });
      }
    });
  }
}


