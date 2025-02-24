export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }
  
  preload() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    let progressBar = this.add.graphics();
    let progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width/2 - 160, height/2 - 30, 320, 50);

    const loadingText = this.make.text({
      x: width/2,
      y: height/2 - 50,
      text: 'Cargando...',
      style: { font: '20px monospace', fill: '#ffffff' }
    }).setOrigin(0.5);

    this.load.on('progress', (value) => {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(width/2 - 150, height/2 - 20, 300 * value, 30);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
    });
    
    // Imágenes
    this.load.image('menu_bg', 'assets/images/menu_bg.jpg');
    this.load.image('congress_bg', 'assets/images/congress_bg.jpg');
    this.load.image('milei', 'assets/images/milei.png');
    this.load.image('vote_icon', 'assets/images/vote_icon.png');
    this.load.image('boicot_icon', 'assets/images/boicot_icon.png');
    this.load.image('debate_icon', 'assets/images/debate_icon.png');
    this.load.image('success_bg', 'assets/images/success_bg.jpg');
    this.load.image('failure_bg', 'assets/images/failure_bg.jpg');

    // Audios
    this.load.audio('background', 'assets/sounds/background.mp3');
    this.load.audio('click', 'assets/sounds/click.wav');
    this.load.audio('success', 'assets/sounds/success.wav');
    this.load.audio('failure', 'assets/sounds/failure.wav');
    this.load.audio('debate', 'assets/sounds/debate.mp3');
    this.load.audio('boicot', 'assets/sounds/boicot.wav');
  }
  
  create() {
    const music = this.sound.add('background', { volume: 0.5, loop: true });
    music.play();
    this.scene.start('TutorialScene');
  }
}
