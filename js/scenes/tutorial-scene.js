export default class TutorialScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TutorialScene' });
  }
  
  create() {
    // Obtén el tamaño actual de la cámara (canvas)
    const camWidth = this.cameras.main.width;
    const camHeight = this.cameras.main.height;
    
    // Fondo: se ajusta al tamaño del canvas
    const bg = this.add.image(camWidth / 2, camHeight / 2, 'menu_bg');
    bg.setDisplaySize(camWidth, camHeight);
    bg.setAlpha(0.5);
    
    // Overlay para mejorar la legibilidad: se ubica en el centro y ocupa casi el 50% de la altura
    this.add.rectangle(camWidth / 2, camHeight / 2, camWidth - 50, camHeight * 0.5, 0x000000, 0.6);
    
    // Texto del tutorial: definido como un array de instrucciones
    const tutorialText = [
      "Bienvenido a Milei - El Gran Soborno",
      "Tu misión es evitar que se vote la comisión investigadora del escándalo cripto de Milei, comprando la lealtad de diputados y senadores corruptos.",
      "Podrás identificar a los políticos corruptos, ofrecerles cargos y favores o sobornarlos con dinero.",
      "Cada elección disparará un minijuego único con instrucciones en pantalla. ¡Atento a cada detalle!",
      "¡Tu éxito definirá el futuro del país!"
    ];
    
    let currentLine = 0;
    const wrapWidth = camWidth - 100; // Ancho máximo para el wordWrap
    // Posicionar el texto en el centro vertical del overlay
    const textY = camHeight / 2;
    const textObj = this.add.text(camWidth / 2, textY, tutorialText[currentLine], {
      fontSize: '24px',
      fill: '#fff',
      align: 'center',
      wordWrap: { width: wrapWidth }
    }).setOrigin(0.5);
    textObj.setShadow(2, 2, "#000", 2, true, true);
    
    // Botón "Siguiente": se posiciona en el 75% de la altura del canvas
    const buttonY = camHeight * 0.75;
    const nextButton = this.add.text(camWidth / 2, buttonY, 'Siguiente', {
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
        // Transición de salida con fade y pasar al menú
        this.cameras.main.fade(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start('MenuScene');
        });
      }
    });
  }
}

