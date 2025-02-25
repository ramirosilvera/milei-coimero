export default class TutorialScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TutorialScene' });
  }
  
  create() {
    // Fondo y overlay para legibilidad
    this.add.image(600, 400, 'menu_bg').setAlpha(0.5);
    this.add.rectangle(600, 400, 1100, 300, 0x000000, 0.6);
    
    const tutorialText = [
      "Bienvenido a Cripto Revolución - La Jugada de Milei.",
      "Aquí tomarás decisiones estratégicas que afectarán el destino del país.",
      "Lee la narrativa, elige tus acciones y enfrenta mini-juegos que pondrán a prueba tu rapidez y estrategia.",
      "Tus elecciones modificarán el poder del establecimiento, los medios y el apoyo popular.",
      "¡Prepárate para una experiencia política interactiva y dinámica!"
    ];
    
    let currentLine = 0;
    const textObj = this.add.text(600, 300, tutorialText[currentLine], {
      fontSize: '24px',
      fill: '#fff',
      align: 'center',
      wordWrap: { width: 1000 }
    }).setOrigin(0.5);
    textObj.setShadow(2, 2, "#000", 2, true, true);
    
    const nextButton = this.add.text(600, 600, 'Siguiente', { fontSize: '28px', fill: '#0f0' })
      .setInteractive({ useHandCursor: true })
      .setOrigin(0.5);
    
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


