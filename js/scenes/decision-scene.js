class DecisionScene extends Phaser.Scene {
    constructor() {
        super({ key: 'DecisionScene' });
    }

    init(data) {
        this.narrative = data.narrative;
        this.progression = data.progression;
    }

    create() {
        // Fondo dinámico
        this.add.image(600, 400, 'congress_bg')
            .setAlpha(0.9)
            .setScale(1.1);

        // Texto de contexto
        this.add.text(600, 100, 'Elige tu estrategia:', {
            fontSize: '36px',
            color: '#FFD700'
        }).setOrigin(0.5);

        // Opciones de decisión
        this.createDecisionOption('boicot', 250, 'Boicot Radical', 'boicot_icon');
        this.createDecisionOption('sutil', 400, 'Intervención Sutil', 'debate_icon');
        this.createDecisionOption('media', 550, 'Campaña en Medios', 'vote_icon');
    }

    createDecisionOption(decisionKey, y, text, iconKey) {
        const container = this.add.container(600, y)
            .setInteractive(new Phaser.Geom.Rectangle(-200, -50, 400, 100), Phaser.Geom.Rectangle.Contains)
            .on('pointerdown', () => this.selectDecision(decisionKey));

        // Fondo animado
        const bg = this.add.rectangle(0, 0, 400, 100, 0x000000, 0.6)
            .setStrokeStyle(2, 0x8b4513);
        
        // Ícono
        const icon = this.add.image(-150, 0, iconKey)
            .setScale(0.7);
        
        // Texto
        const label = this.add.text(0, 0, text, {
            fontSize: '24px',
            color: '#FFF'
        }).setOrigin(0.5, 0.5);

        // Animación hover
        container.on('pointerover', () => {
            bg.setFillStyle(0x8b4513, 0.3);
            this.tweens.add({
                targets: icon,
                scale: 0.8,
                duration: 200
            });
        });

        container.on('pointerout', () => {
            bg.setFillStyle(0x000000, 0.6);
            this.tweens.add({
                targets: icon,
                scale: 0.7,
                duration: 200
            });
        });

        container.add([bg, icon, label]);
    }

    selectDecision(decisionKey) {
        this.narrative.applyDecision(decisionKey);
        this.progression.checkAchievements(this.narrative);
        
        let targetScene;
        switch(decisionKey) {
            case 'boicot': targetScene = 'BoicotScene'; break;
            case 'sutil': targetScene = 'SutilScene'; break;
            case 'media': targetScene = 'BoicotScene'; break; // Temporal
        }
        
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start(targetScene, {
                narrative: this.narrative,
                progression: this.progression
            });
        });
    }
}
