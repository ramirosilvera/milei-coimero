class SutilScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SutilScene' });
    }

    init(data) {
        this.narrative = data.narrative;
        this.progression = data.progression;
    }

    create() {
        // Configuración del juego de influencia sutil
        this.influenceGrid = this.createInfluenceGrid();
        this.selectedCells = new Set();
        this.currentScore = 0;
        
        // UI
        this.setupUI();
        this.setupEvents();
    }

    createInfluenceGrid() {
        const grid = [];
        const startX = 200;
        const startY = 150;
        
        for (let row = 0; row < 5; row++) {
            grid[row] = [];
            for (let col = 0; col < 8; col++) {
                const x = startX + (col * 100);
                const y = startY + (row * 100);
                const cell = this.add.image(x, y, 'debate_icon')
                    .setInteractive()
                    .setScale(0.6)
                    .setAlpha(0.8);
                
                cell.on('pointerdown', () => this.handleCellClick(cell, row, col));
                grid[row][col] = cell;
            }
        }
        return grid;
    }

    handleCellClick(cell, row, col) {
        if (!this.selectedCells.has(`${row}-${col}`)) {
            this.selectedCells.add(`${row}-${col}`);
            cell.setTint(0x00FF00).setAlpha(1);
            this.currentScore += 10;
            this.updateScore();
            this.narrative.factions.medios += 2;
        }
    }

    setupUI() {
        this.scoreText = this.add.text(20, 20, 'Influencia: 0', {
            fontSize: '32px',
            color: '#FFD700'
        });
        
        this.timer = this.add.text(1100, 20, 'Tiempo: 30', {
            fontSize: '32px',
            color: '#FFD700'
        }).setOrigin(1, 0);
    }

    updateScore() {
        this.scoreText.setText(`Influencia: ${this.currentScore}`);
    }

    setupEvents() {
        this.timeLeft = 30;
        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.timeLeft--;
                this.timer.setText(`Tiempo: ${this.timeLeft}`);
                if (this.timeLeft <= 0) this.endGame();
            },
            loop: true
        });
    }

    endGame() {
        this.progression.highScores.sutil = Math.max(
            this.progression.highScores.sutil,
            this.currentScore
        );
        
        this.scene.start('EndScene', {
            narrative: this.narrative,
            score: this.currentScore,
            strategy: 'sutil'
        });
    }
}
