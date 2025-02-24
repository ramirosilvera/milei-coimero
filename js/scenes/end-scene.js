class EndScene extends Phaser.Scene {
    constructor() {
        super({ key: 'EndScene' });
    }

    init(data) {
        this.narrative = data.narrative;
        this.finalScore = data.score || 0;
        this.strategy = data.strategy || 'unknown';
    }

    create() {
        // Fondo según resultado
        const endingType = this.narrative.getCurrentEnding();
        const bgKey = this.getBackgroundKey(endingType);
        this.add.image(600, 400, bgKey).setScale(1.1);

        // Texto del resultado
        this.createResultText(endingType);
        
        // Estadísticas detalladas
        this.showFactionStats();
        
        // Botón de reinicio
        this.createRestartButton();
        
        // Sonido de fin
        this.playEndingSound(endingType);
    }

    getBackgroundKey(endingType) {
        const backgrounds = {
            revolucion: 'success_bg',
            apoyo_masivo: 'success_bg',
            continua_lucha: 'failure_bg'
        };
        return backgrounds[endingType] || 'failure_bg';
    }

    createResultText(endingType) {
        const messages = {
            revolucion: '¡Revolución Exitosa!\nEl sistema ha sido derrocado',
            apoyo_masivo: 'Apoyo Popular Masivo\nLa revolución avanza',
            continua_lucha: 'La lucha continúa...\nSigue resistiendo'
        };
        
        this.add.text(600, 150, messages[endingType], {
            fontSize: '48px',
            color: '#FFD700',
            align: 'center'
        }).setOrigin(0.5);
    }

    showFactionStats() {
        let y = 300;
        Object.entries(this.narrative.factions).forEach(([name, value]) => {
            this.add.text(200, y, `${name}:`, { fontSize: '24px' })
                .setOrigin(0, 0.5);
            
            this.add.rectangle(500, y, 300, 20, 0x333333)
                .setOrigin(0, 0.5);
            
            this.add.rectangle(500, y, 300 * (value/100), 18, 0x8b4513)
                .setOrigin(0, 0.5);
            
            y += 40;
        });
    }

    createRestartButton() {
        const btn = this.add.container(600, 700)
            .setInteractive(new Phaser.Geom.Rectangle(-100, -25, 200, 50), Phaser.Geom.Rectangle.Contains)
            .on('pointerdown', () => {
                this.sound.play('click_sound');
                this.scene.start('MenuScene');
            });
        
        btn.add(this.add.rectangle(0, 0, 200, 50, 0x000000, 0.7)
            .setStrokeStyle(2, 0x8b4513));
        
        btn.add(this.add.text(0, 0, 'Volver al Menú', {
            fontSize: '24px',
            color: '#FFF'
        }).setOrigin(0.5));
    }

    playEndingSound(endingType) {
        const sounds = {
            revolucion: 'success',
            apoyo_masivo: 'success',
            continua_lucha: 'failure'
        };
        this.sound.play(sounds[endingType]);
    }
}
