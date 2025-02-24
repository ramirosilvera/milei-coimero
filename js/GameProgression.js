class GameProgression {
    constructor() {
        this.unlockedEndings = [];
        this.achievements = [];
        this.highScores = {
            boicot: 0,
            sutil: 0,
            media: 0
        };
        this.loadGame();
    }

    saveGame() {
        localStorage.setItem('gameProgression', JSON.stringify({
            unlockedEndings: this.unlockedEndings,
            achievements: this.achievements,
            highScores: this.highScores
        }));
    }

    loadGame() {
        const savedData = localStorage.getItem('gameProgression');
        if (savedData) {
            const data = JSON.parse(savedData);
            this.unlockedEndings = data.unlockedEndings || [];
            this.achievements = data.achievements || [];
            this.highScores = data.highScores || {};
        }
    }

    checkAchievements(narrative) {
        if (narrative.factions.establishment <= 10 && !this.achievements.includes('revolucionario')) {
            this.unlockAchievement('Revolucionario', 'Derrocaste al establishment');
        }
        if (narrative.factions.poblacion >= 80 && !this.achievements.includes('líder_popular')) {
            this.unlockAchievement('Líder Popular', 'Ganaste el apoyo masivo del pueblo');
        }
    }

    unlockAchievement(name, description) {
        this.achievements.push({ name, description });
        this.saveGame();
        this.showAchievementPopup(name);
    }

    showAchievementPopup(name) {
        const popup = document.createElement('div');
        popup.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0,0,0,0.9);
            color: #FFD700;
            padding: 15px;
            border: 2px solid #8b4513;
            border-radius: 10px;
            font-family: Arial;
            transition: transform 0.5s;
        `;
        popup.textContent = `¡Logro desbloqueado!\n${name}`;
        document.body.appendChild(popup);

        setTimeout(() => {
            popup.style.transform = 'translateX(0)';
            setTimeout(() => popup.remove(), 3000);
        }, 100);
    }
}
