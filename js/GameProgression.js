class GameProgression {
    constructor() {
        this.unlockedEndings = [];
        this.achievements = [];
        this.highScores = {
            boicot: 0,
            sutil: 0
        };
    }

    checkAchievements(narrative) {
        if (narrative.factions.establishment <= 10 && !this.achievements.includes('revolucionario')) {
            this.unlockAchievement('Revolucionario', 'Derrocaste al establishment');
        }
    }

    unlockAchievement(name, description) {
        this.achievements.push({ name, description });
        this.showAchievementPopup(name);
    }

    showAchievementPopup(name) {
        const popup = document.createElement('div');
        popup.className = 'achievement-popup';
        popup.textContent = `¡Logro desbloqueado: ${name}!`;
        document.body.appendChild(popup);
        setTimeout(() => popup.remove(), 3000);
    }
}
