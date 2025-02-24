class BoicotScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BoicotScene' });
    }

    init(data) {
        this.narrative = data.narrative;
        this.progression = data.progression;
    }

    create() {
        // Configurar física y límites
        this.physics.world.setBounds(0, 0, 1200, 800);
        this.physics.world.setBoundsCollision(true, true, true, true);
        
        this.icons = this.physics.add.group({
            collideWorldBounds: true,
            bounceX: 0.5,
            bounceY: 0.3
        });

        // Temporizador de generación
        this.time.addEvent({
            delay: 800,
            callback: this.spawnIcon,
            callbackScope: this,
            loop: true
        });

        // UI mejorada
        this.setupUI();
    }

    spawnIcon() {
        const icon = this.icons.create(
            Phaser.Math.Between(100, 1100),
            Phaser.Math.Between(-100, -50),
            'vote_icon'
        )
        .setInteractive()
        .setScale(0.7)
        .setGravityY(200)
        .setCollideWorldBounds(true);

        // Auto-destrucción después de 5 segundos
        this.time.delayedCall(5000, () => {
            if (icon.active) icon.destroy();
        });

        icon.on('pointerdown', () => this.handleIconClick(icon));
    }

    handleIconClick(icon) {
        // Efectos visuales
        this.tweens.add({
            targets: icon,
            scale: 0,
            alpha: 0,
            duration: 200,
            onComplete: () => icon.destroy()
        });

        // Partículas
        this.add.particles(icon.x, icon.y, 'red', {
            speed: { min: -100, max: 100 },
            scale: { start: 0.5, end: 0 },
            blendMode: 'ADD',
            lifespan: 1000,
            quantity: 5
        });

        // Actualizar estado del juego
        this.narrative.factions.establishment -= 3;
        this.progression.checkAchievements(this.narrative);
        this.updateScore(10);
    }

    setupUI() {
        this.scoreText = this.add.text(20, 20, 'Puntos: 0', {
            fontSize: '32px',
            color: '#FFD700',
            fontFamily: 'Arial',
            stroke: '#000',
            strokeThickness: 2
        });
        
        // Temporizador mejorado
        this.timeLeft = 30;
        this.timerText = this.add.text(1180, 20, `Tiempo: ${this.timeLeft}`, {
            fontSize: '32px',
            color: '#FFD700',
            fontFamily: 'Arial',
            stroke: '#000',
            strokeThickness: 2
        }).setOrigin(1, 0);

        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.timeLeft--;
                this.timerText.setText(`Tiempo: ${this.timeLeft}`);
                if (this.timeLeft <= 0) this.endGame();
            },
            loop: true
        });
    }

    updateScore(points) {
        this.currentScore = (this.currentScore || 0) + points;
        this.scoreText.setText(`Puntos: ${this.currentScore}`);
    }

    endGame() {
        this.progression.highScores.boicot = Math.max(
            this.progression.highScores.boicot,
            this.currentScore
        );
        this.scene.start('EndScene', {
            narrative: this.narrative,
            score: this.currentScore,
            strategy: 'boicot'
        });
    }
}
