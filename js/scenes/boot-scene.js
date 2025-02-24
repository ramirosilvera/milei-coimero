export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }
  preload() {
    // Cargamos imágenes
    this.load.image('menu_bg', 'assets/images/menu_bg.jpg');
    this.load.image('congress_bg', 'assets/images/congress_bg.jpg');
    this.load.image('milei', 'assets/images/milei.png');
    this.load.image('vote_icon', 'assets/images/vote_icon.png');
    this.load.image('boicot_icon', 'assets/images/boicot_icon.png');
    this.load.image('debate_icon', 'assets/images/debate_icon.png');
    this.load.image('success_bg', 'assets/images/success_bg.jpg');
    this.load.image('failure_bg', 'assets/images/failure_bg.jpg');
    // Cargamos audios
    this.load.audio('background', 'assets/sounds/background.mp3');
    this.load.audio('click', 'assets/sounds/click.wav');
    this.load.audio('success', 'assets/sounds/success.wav');
    this.load.audio('failure', 'assets/sounds/failure.wav');
    this.load.audio('debate', 'assets/sounds/debate.mp3');
    this.load.audio('boicot', 'assets/sounds/boicot.wav');
  }
  create() {
    // Una vez precargados los assets, vamos al menú principal.
    this.scene.start('MenuScene');
  }
}

