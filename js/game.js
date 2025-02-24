class NarrativeManager {
    constructor() {
        this.storyFlags = {
            publicOpinion: 50,
            congressionalSupport: 30,
            cryptoAllies: 0,
            keyDecisions: []
        };
    }

    applyDecision(decision) {
        const effects = {
            'boicot': { congressionalSupport: -15, publicOpinion: 10 },
            'sutil': { cryptoAllies: 2, congressionalSupport: 5 },
            'media': { publicOpinion: 20, congressionalSupport: -10 }
        };
        
        Object.entries(effects[decision]).forEach(([key, val]) => {
            this.storyFlags[key] = Phaser.Math.Clamp(this.storyFlags[key] + val, 0, 100);
        });
        this.storyFlags.keyDecisions.push(decision);
    }
}

class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        this.load.setPath('assets/');
        
        // Images
        this.load.image('menuBg', 'images/menu_bg.jpg');
        this.load.image('congressBg', 'images/congress_bg.jpg');
        this.load.image('milei', 'images/milei.png');
        this.load.image('voteIcon', 'images/vote_icon.png');
        this.load.image('boicotIcon', 'images/boicot_icon.png');
        this.load.image('debateIcon', 'images/debate_icon.png');
        this.load.image('successBg', 'images/success_bg.jpg');
        this.load.image('failureBg', 'images/failure_bg.jpg');

        // Sounds
        this.load.audio('bgMusic', 'sounds/background.mp3');
        this.load.audio('clickSound', 'sounds/click.wav');
        this.load.audio('successSound', 'sounds/success.wav');
        this.load.audio('failureSound', 'sounds/failure.wav');
        this.load.audio('debateAmbience', 'sounds/debate.mp3');
        this.load.audio('boicotSound', 'sounds/boicot.wav');

        // Progress bar
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
        this.sound.pauseOnBlur = false;
        this.scene.start('MenuScene');
    }
}

class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        this.add.image(600, 400, 'menuBg').setScale(1.2);
        
        const title = this.add.text(600, 150, 'Milei: Cripto Revolución', {
            fontSize: '48px',
            fontFamily: 'Roboto Condensed',
            color: '#FFD700'
        }).setOrigin(0.5);

        this.createButton(600, 300, 'Nueva Partida', 'StoryScene');
        this.createButton(600, 400, 'Cargar Partida', 'LoadScene');
        this.createButton(600, 500, 'Salir', () => window.close());

        this.sound.play('bgMusic', { loop: true, volume: 0.4 });
    }

    createButton(x, y, text, action) {
        const btn = this.add.container(x, y)
            .setInteractive(new Phaser.Geom.Rectangle(-100, -20, 200, 40), Phaser.Geom.Rectangle.Contains)
            .on('pointerover', () => btn.y -= 5)
            .on('pointerout', () => btn.y += 5)
            .on('pointerdown', () => {
                this.sound.play('clickSound');
                if (typeof action === 'string') {
                    this.scene.start(action);
                } else {
                    action();
                }
            });

        btn.add(this.add.rectangle(0, 0, 200, 40, 0x8b4513));
        btn.add(this.add.text(0, 0, text, {
            fontFamily: 'Roboto Condensed',
            fontSize: '24px'
        }).setOrigin(0.5));
    }
}

class StoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StoryScene' });
    }

    create() {
        this.narrativeManager = new NarrativeManager();
        this.add.image(600, 400, 'congressBg').setAlpha(0.9);

        const dialogBox = this.add.container(0, 0);
        const bg = this.add.rectangle(600, 300, 1000, 200, 0x000000, 0.8)
            .setOrigin(0.5);
        
        const text = this.add.text(150, 250, 
            'El país se encuentra en una encrucijada económica. Como asesor de Milei,\n¿qué estrategia implementarás para la revolución cripto?', {
            fontSize: '24px',
            fontFamily: 'Roboto Condensed',
            color: '#FFFFFF',
            align: 'center'
        }).setOrigin(0, 0.5);

        dialogBox.add([bg, text]);
        
        this.time.delayedCall(3000, () => {
            this.scene.start('DecisionScene', { narrativeManager: this.narrativeManager });
        });
    }
}

class DecisionScene extends Phaser.Scene {
    constructor() {
        super({ key: 'DecisionScene' });
    }

    create() {
        this.add.image(600, 400, 'congressBg').setAlpha(0.85);
        const choices = [
            { text: 'Boicot Radical', key: 'boicot', icon: 'boicotIcon' },
            { text: 'Intervención Sutil', key: 'sutil', icon: 'debateIcon' },
            { text: 'Campaña en Medios', key: 'media', icon: 'voteIcon' }
        ];

        choices.forEach((choice, index) => {
            this.createChoiceButton(600, 200 + (index * 150), choice);
        });
    }

    createChoiceButton(x, y, choice) {
        const btn = this.add.container(x, y)
            .setInteractive()
            .on('pointerdown', () => {
                this.narrativeManager.applyDecision(choice.key);
                this.sound.play(choice.key === 'boicot' ? 'boicotSound' : 'clickSound');
                fadeOutAndStart(this, 'MiniGameScene', { strategy: choice.key });
            });

        const icon = this.add.image(-80, 0, choice.icon).setScale(0.7);
        const text = this.add.text(0, 0, choice.text, {
            fontSize: '28px',
            fontFamily: 'Roboto Condensed'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: btn,
            scale: 0.95,
            duration: 100,
            yoyo: true,
            paused: true
        });

        btn.add([icon, text]);
    }
}

class MiniGameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MiniGameScene' });
    }

    init(data) {
        this.strategy = data.strategy;
        this.score = 0;
    }

    create() {
        this.physics.world.setBounds(0, 0, 1200, 800);
        this.setupUI();
        this.setupGame();
    }

    setupUI() {
        this.scoreText = this.add.text(20, 20, 'Puntos: 0', {
            fontSize: '32px',
            fontFamily: 'Roboto Condensed',
            color: '#FFD700'
        });

        this.timerBar = this.add.rectangle(600, 760, 1000, 20, 0x8b4513)
            .setOrigin(0.5, 1);
    }

    setupGame() {
        this.timeLeft = 30000;
        this.startTime = this.time.now;

        this.time.addEvent({
            delay: 700,
            callback: () => this.spawnIcon(),
            loop: true
        });

        this.sound.play(this.strategy === 'boicot' ? 'boicotSound' : 'debateAmbience', {
            loop: true,
            volume: 0.3
        });
    }

    spawnIcon() {
        const icon = this.physics.add.image(
            Phaser.Math.Between(100, 1100),
            Phaser.Math.Between(100, 700),
            this.strategy === 'boicot' ? 'voteIcon' : 'debateIcon'
        ).setScale(0.6).setInteractive();

        icon.on('pointerdown', () => {
            this.handleIconClick(icon);
            this.sound.play('clickSound');
        });

        this.tweens.add({
            targets: icon,
            angle: 360,
            duration: 2000,
            repeat: -1
        });

        this.time.delayedCall(1500, () => icon.destroy());
    }

    handleIconClick(icon) {
        icon.destroy();
        this.score += 10;
        this.scoreText.setText(`Puntos: ${this.score}`);
    }

    update() {
        const elapsed = this.time.now - this.startTime;
        this.timerBar.width = 1000 * (1 - (elapsed / this.timeLeft));
        
        if (elapsed >= this.timeLeft) {
            this.endGame();
        }
    }

    endGame() {
        this.sound.stopAll();
        fadeOutAndStart(this, 'EndScene', { 
            score: this.score,
            strategy: this.strategy 
        });
    }
}

class EndScene extends Phaser.Scene {
    init(data) {
        this.finalScore = data.score;
        this.strategy = data.strategy;
    }

    create() {
        const bgKey = this.finalScore >= 100 ? 'successBg' : 'failureBg';
        this.add.image(600, 400, bgKey).setScale(1.2);

        const resultText = this.getResultText();
        const text = this.add.text(600, 200, resultText, {
            fontSize: '36px',
            fontFamily: 'Roboto Condensed',
            align: 'center',
            color: '#FFD700'
        }).setOrigin(0.5);

        this.sound.play(this.finalScore >= 100 ? 'successSound' : 'failureSound');

        this.time.delayedCall(3000, () => {
            fadeOutAndStart(this, 'MenuScene');
        });
    }

    getResultText() {
        if (this.strategy === 'boicot') {
            return this.finalScore >= 100 ? 
                '¡Boicot exitoso!\nLa revolución cripto avanza!' : 
                'El boicot fracasó...\nSe necesitan nuevas estrategias';
        }
        return this.finalScore >= 100 ? 
            'Influencia exitosa!\nEl debate cambió a tu favor' : 
            'La influencia fue detectada\nLa oposición contraataca';
    }
}

// Funciones auxiliares
function fadeOutAndStart(scene, targetScene, data = {}) {
    scene.cameras.main.fadeOut(800, 0, 0, 0);
    scene.cameras.main.once('camerafadeoutcomplete', () => {
        scene.scene.start(targetScene, data);
    });
}

// Configuración de Phaser
const config = {
    type: Phaser.WEBGL,
    width: 1200,
    height: 800,
    parent: 'game-container',
    scene: [BootScene, MenuScene, StoryScene, DecisionScene, MiniGameScene, EndScene],
    physics: { default: 'arcade' },
    audio: { disableWebAudio: false }
};

new Phaser.Game(config);
