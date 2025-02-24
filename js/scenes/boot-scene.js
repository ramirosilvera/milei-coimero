class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Configurar rutas relativas correctas
        this.load.setPath('./assets/');
        
        // Imágenes
        this.load.image('menu_bg', 'images/menu_bg.jpg');
        this.load.image('congress_bg', 'images/congress_bg.jpg');
        this.load.image('milei', 'images/milei.png');
        this.load.image('vote_icon', 'images/vote_icon.png');
        this.load.image('boicot_icon', 'images/boicot_icon.png');
        this.load.image('debate_icon', 'images/debate_icon.png');
        this.load.image('success_bg', 'images/success_bg.jpg');
        this.load.image('failure_bg', 'images/failure_bg.jpg');

        // Sonidos
        this.load.audio('bg_music', 'sounds/background.mp3');
        this.load.audio('click_sound', 'sounds/click.wav');
        this.load.audio('success', 'sounds/success.wav');
        this.load.audio('failure', 'sounds/failure.wav');

        // Barra de carga
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(240, 270, 320, 50);
        
        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0x8b4513, 1);
            progressBar.fillRect(250, 280, 300 * value, 30);
        });
    }

    create() {
        this.scene.start('MenuScene');
    }
}
