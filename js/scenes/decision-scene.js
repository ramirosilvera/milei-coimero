class DecisionScene extends Phaser.Scene {
    constructor() {
        super({ key: 'DecisionScene' });
    }

    init(data) {
        this.narrative = data.narrative;
        this.progression = data.progression;
    }

    create() {
        // Fondo dinámico con animación
        this.add.tileSprite(600, 400, 1200, 800, 'congress_bg')
            .setScrollFactor(0)
            .setTileScale(1.1);
        
        // Título con efecto
        const title = this.add.text(600, 100, 'Estrategia Cripto', {
            fontSize: '48px',
            color: '#FFD700',
            fontFamily: 'Arial',
            stroke: '#000',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: title,
            y: 110,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });

        // Opciones de decisión
        this.createDecisionCard('boicot', 300, 'Boicot Radical', 'Destruye el sistema actual');
        this.createDecisionCard('sutil', 450, 'Influencia Sutil', 'Manipula las instituciones');
        this.createDecisionCard('media', 600, 'Campaña Medial', 'Controla la narrativa pública');
    }

    createDecisionCard(key, y, title, description) {
        const card = this.add.container(600, y)
            .setInteractive(new Phaser.Geom.Rectangle(-250, -75, 500, 150), Phaser.Geom.Rectangle.Contains)
            .on('pointerdown', () => this.selectStrategy(key));

        // Fondo animado
        const bg = this.add.rectangle(0, 0, 500, 150, 0x000000, 0.7)
            .setStrokeStyle(3, 0x8b4513);
        
        // Icono
        const icon = this.add.image(-200, 0, `${key}_icon`)
            .setScale(0.8);
        
        // Textos
        const titleText = this.add.text(-50, -30, title, {
            fontSize: '24px',
            color: '#FFD700',
            fontFamily: 'Arial'
        }).setOrigin(0, 0.5);
        
        const descText = this.add.text(-50, 30, description, {
            fontSize: '18px',
            color: '#FFF',
            fontFamily: 'Arial',
            wordWrap: { width: 350 }
        }).setOrigin(0, 0.5);

        // Animación hover
        card.on('pointerover', () => {
            bg.setFillStyle(0x8b4513, 0.3);
            this.tweens.add({
                targets: icon,
                scale: 0.9,
                duration: 200
            });
        });

        card.on('pointerout', () => {
            bg.setFillStyle(0x000000, 0.7);
            this.tweens.add({
                targets: icon,
                scale: 0.8,
                duration: 200
            });
        });

        card.add([bg, icon, titleText, descText]);
    }

    selectStrategy(key) {
        this.narrative.applyDecision(key);
        this.progression.saveGame();
        
        const sceneMap = {
            boicot: 'BoicotScene',
            sutil: 'SutilScene',
            media: 'MediaScene'
        };

        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start(sceneMap[key], {
                narrative: this.narrative,
                progression: this.progression
            });
        });
    }
}
