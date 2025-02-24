class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        // Fondo animado
        this.add.tileSprite(600, 400, 1200, 800, 'menu_bg')
            .setScrollFactor(0)
            .setTileScale(1.2)
            .setAlpha(0.9);
        
        // Título con efecto
        const title = this.add.text(600, 150, 'Revolución Cripto', {
            fontSize: '64px',
            fontFamily: 'Arial',
            color: '#FFD700',
            stroke: '#000',
            strokeThickness: 5
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: title,
            scale: 1.1,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });

        // Botones interactivos
        this.createButton('Nueva Partida', 300, () => this.startGame());
        this.createButton('Cargar Partida', 400, () => this.loadGame());
        this.createButton('Créditos', 500, () => this.showCredits());

        // Música de fondo
        this.sound.play('bg_music', { loop: true, volume: 0.3 });
    }

    createButton(y, text, action) {
        const btn = this.add.container(600, y)
            .setInteractive(new Phaser.Geom.Rectangle(-125, -25, 250, 50), Phaser.Geom.Rectangle.Contains)
            .on('pointerover', () => {
                btn.getAt(1).setColor('#FFD700');
                this.tweens.add({ targets: btn, scale: 1.05, duration: 150 });
            })
            .on('pointerout', () => {
                btn.getAt(1).setColor('#FFF');
                this.tweens.add({ targets: btn, scale: 1, duration: 150 });
            })
            .on('pointerdown', () => {
                this.sound.play('click_sound');
                action();
            });

        // Fondo del botón
        btn.add(this.add.rectangle(0, 0, 250, 50, 0x000000, 0.7)
            .setStrokeStyle(2, 0x8b4513);
        
        // Texto del botón
        btn.add(this.add.text(0, 0, text, {
            fontSize: '28px',
            color: '#FFF'
        }).setOrigin(0.5));
    }

    startGame() {
        this.scene.start('DecisionScene', {
            narrative: new NarrativeManager(),
            progression: new GameProgression()
        });
    }

    loadGame() {
        // Lógica de carga de partida
    }
}
