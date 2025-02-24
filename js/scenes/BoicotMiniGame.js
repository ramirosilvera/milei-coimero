class BoicotMiniGame extends Phaser.Scene {
    constructor() {
        super({ key: 'BoicotMiniGame' });
    }

    init(data) {
        this.narrative = data.narrative;
    }

    create() {
        // Configurar mecánica de barra de potencia
        this.powerBar = this.add.rectangle(600, 700, 300, 20, 0xffffff)
            .setOrigin(0.5);
        
        this.power = 0;
        this.tweens.add({
            targets: this.powerBar,
            scaleX: 0,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            onUpdate: () => {
                this.power = 1 - this.powerBar.scaleX;
            }
        });

        // Lógica de clic
        this.input.on('pointerdown', () => {
            const damage = Math.floor(30 * this.power);
            this.narrative.factions.establishment -= damage;
            this.checkProgress();
        });
    }

    checkProgress() {
        if (this.narrative.factions.establishment <= 0) {
            this.endGame(true);
        }
    }

    endGame(success) {
        this.scene.start('EndScene', { 
            narrative: this.narrative,
            success: success
        });
    }
}
