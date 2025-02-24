class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Cargar assets
        this.load.setPath('assets/');
        
        // Imágenes
        this.load.image('menu_bg', 'images/menu_bg.jpg');
        this.load.image('congress_bg', 'images/congress_bg.jpg');
        this.load.image('milei', 'images/milei.png');
        this.load.image('vote_icon', 'images/vote_icon.png');
        this.load.image('boicot_icon', 'images/boicot_icon.png');
        
        // Sonidos
        this.load.audio('bg_music', 'sounds/background.mp3');
        this.load.audio('click_sound', 'sounds/click.wav');
    }

    create() {
        this.scene.start('MenuScene');
    }
}
