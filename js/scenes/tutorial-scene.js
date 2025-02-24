export default class TutorialScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TutorialScene' });
  }
  
  create() {
    // Fondo del tutorial
    this.add.image(600, 400, 'menu_bg').setAlpha(0.5);
    
    const tutorialText = [
      "Bienvenido a Cripto Revolución - La Jugada de Milei.",
      "En este juego tomarás decisiones estratégicas para boicotear una comisión investigadora.",
      "Existen tres estrategias:",
      "1. Boicot Radical: Haz clic rápidamente para debilitar al sistema.",
      "2. Influencia Sutil: Presiona la tecla indicada para manipular a los medios.",
      "3. Campaña Medial: Sincroniza tu ritmo para ganar el apoyo popular.",
      "¡Atento a los distractores y varía tus acciones según la situación!"
    ];
    
    let currentLine = 0;
    const textObj = this.add.text(600, 300, tutorialText[currentLine], {
      fontSize: '24px',
      fill: '#fff',
      align: 'center',
      wordWrap: { width: 1000 }
    }).setOrigin(0.5);
    
    const nextButton = this.add.text(600, 600, 'Siguiente', { fontSize: '28px', fill: '#0f0' })
      .setInteractive({ useHandCursor: true })
      .setOrigin(0.5);
    
    nextButton.on('pointerdown', () => {
      this.sound.play('click');
      currentLine++;
      if (currentLine < tutorialText.length) {
        textObj.setText(tutorialText[currentLine]);
      } else {
        // Transición al menú principal con un efecto fade out
        this.cameras.main.fade(500, 0, 0, 0);
        this.cameras.main.on('camerafadeoutcomplete', () => {
          this.scene.start('MenuScene');
        });
      }
    });
  }
}
