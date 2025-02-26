export default class TutorialScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TutorialScene' });
  }
  
  create() {
    const camWidth = this.cameras.main.width;
    const camHeight = this.cameras.main.height;
    
    // Fondo y overlay para legibilidad
    const bg = this.add.image(camWidth / 2, camHeight / 2, 'menu_bg');
    bg.setDisplaySize(camWidth, camHeight);
    bg.setAlpha(0.5);
    this.add.rectangle(camWidth / 2, camHeight / 2, camWidth - 50, camHeight * 0.5, 0x000000, 0.6);
    
    const tutorialText = [
      "Bienvenido a Milei el gran soborno.",
      "Tu misión es evitar que se investigue a Milei por el escándalo cripto, comprando la lealtad de diputados, senadores o manipulando el poder judicial.",
      "Elige tu estrategia: Comprar Radicales, Comprar Peronistas o Asignar Jueces por Decreto.",
      "Cada elección disparará un minijuego arcade en el que controlarás a Milei para recolectar monedas y derrotar al enemigo.",
      "¡Recolecta monedas para debilitar al enemigo y ganar el minijuego!",
      "¡Tu éxito definirá el futuro del país!"
    ];
    
    let currentLine = 0;
    const wrapWidth = camWidth - 100;
    const textObj = this.add.text(camWidth / 2, camHeight / 2, tutorialText[currentLine], {
      fontSize: '24px',
      fill: '#fff',
      align: 'center',
      wordWrap: { width: wrapWidth }
    }).setOrigin(0.5);
    textObj.setShadow(2, 2, "#000", 2, true, true);
    
    const nextButton = this.add.text(camWidth / 2, camHeight * 0.75, 'Siguiente', {
      fontSize: '28px',
      fill: '#0f0'
    })
      .setOrigin(0.5)
      .setStyle({ padding: '10px', backgroundColor: '#222' })
      .setInteractive({ useHandCursor: true });
    
    nextButton.on('pointerdown', () => {
      this.sound.play('click');
      currentLine++;
      if (currentLine < tutorialText.length) {
        textObj.setText(tutorialText[currentLine]);
      } else {
        this.cameras.main.fade(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start('MenuScene');
        });
      }
    });
  }
}
