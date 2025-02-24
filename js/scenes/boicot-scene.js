class BoicotScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BoicotScene' });
    }

    init(data) {
        this.narrative = data.narrative;
    }

    create() {
        // Configurar mecánica principal
        this.icons = this.physics.add.group();
        this.score = 0;
        
        // Evento de generación de íconos
        this.time.addEvent({
            delay: 800,
            callback: this.spawnIcon,
            callbackScope: this,
            loop: true
        });

        // UI
        this.setupUI();
    }

    spawnIcon() {
        const icon = this.icons.create(
            Phaser.Math.Between(100, 1100),
            Phaser.Math.Between(-100, -50),
            'vote_icon'
        )
        .setInteractive()
        .on('pointerdown', () => {
            this.handleIconClick(icon);
        });
        
        this.physics.world.enable(icon);
        icon.setGravityY(200);
    }

    handleIconClick(icon) {
        icon.destroy();
        this.score += 10;
        this.narrative.factions.establishment -= 2;
        this.updateUI();
    }

    setupUI() {
        this.scoreText = this.add.text(20, 20, 'Puntos: 0', {
            fontSize: '32px',
            fill: '#FFD700'
        });
    }

    updateUI() {
        this.scoreText.setText(`Puntos: ${this.score}`);
    }
}
