class EndScene extends Phaser.Scene {
    constructor() {
        super({ key: 'EndScene' });
    }

    init(data) {
        this.narrative = data.narrative;
        this.success = data.success;
    }

    create() {
        const endings = {
            revolucion_exitosa: {
                bg: 'successBg',
                text: '¡Revolución Exitosa!\nEl viejo sistema ha caído',
                sound: 'victory'
            },
            apoyo_masivo: {
                bg: 'crowdBg',
                text: 'El pueblo está contigo\nLa revolución avanza',
                sound: 'cheer'
            },
            situacion_inestable: {
                bg: 'unstableBg',
                text: 'Situación inestable\nLa lucha continúa...',
                sound: 'tension'
            }
        };

        const endingKey = this.narrative.getCurrentEnding();
        this.showEnding(endings[endingKey]);
    }

    showEnding(config) {
        this.add.image(600, 400, config.bg).setScale(1.2);
        
        this.add.text(600, 150, config.text, {
            fontSize: '42px',
            fontFamily: 'Roboto Condensed',
            color: '#FFD700',
            align: 'center'
        }).setOrigin(0.5);

        this.sound.play(config.sound);
        this.showFactionStats();
    }

    showFactionStats() {
        let y = 300;
        Object.entries(this.narrative.factions).forEach(([faction, value]) => {
            this.add.text(200, y, `${faction}:`, { fontSize: '24px' })
                .setOrigin(0, 0.5);
            
            this.add.rectangle(500, y, 300, 20, 0x333333)
                .setOrigin(0, 0.5);
            
            this.add.rectangle(500, y, 300 * (value/100), 18, 0x8b4513)
                .setOrigin(0, 0.5);
            
            y += 40;
        });
    }
}
