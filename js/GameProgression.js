class GameProgression {
    constructor() {
        this.unlockedEndings = [];
        this.achievements = {
            revolucionario: false,
            estratega: false,
            influencer: false
        };
        this.highScores = {
            boicot: 0,
            sutil: 0,
            media: 0
        };
    }

    checkAchievements(narrative) {
        if (narrative.factions.establishment <= 10 && !this.achievements.revolucionario) {
            this.unlockAchievement('¡Revolucionario!', 'Derrocaste al establishment');
        }
        if (narrative.factions.medios >= 80 && !this.achievements.influencer) {
            this.unlockAchievement('Influencer Cripto', 'Control total de los medios');
        }
    }

    unlockAchievement(title, description) {
        this.achievements[title] = true;
        const popup = document.createElement('div');
        popup.className = 'achievement-popup';
        popup.innerHTML = `<h3>${title}</h3><p>${description}</p>`;
        document.body.appendChild(popup);
        
        setTimeout(() => {
            popup.style.right = '20px';
            setTimeout(() => popup.remove(), 3000);
        }, 100);
    }
}
