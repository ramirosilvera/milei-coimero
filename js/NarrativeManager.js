class NarrativeManager {
    constructor() {
        this.factions = {
            establishment: 50,
            libertarios: 40,
            medios: 30,
            poblacion: 60
        };
        this.decisions = [];
    }

    applyDecision(decision) {
        const effects = {
            boicot: { establishment: -20, libertarios: +15 },
            sutil: { medios: +25, poblacion: +10 },
            media: { poblacion: +30, establishment: -10 }
        };
        
        Object.entries(effects[decision]).forEach(([faction, value]) => {
            this.factions[faction] = Phaser.Math.Clamp(this.factions[faction] + value, 0, 100);
        });
        
        this.decisions.push({
            decision,
            timestamp: Date.now(),
            factions: {...this.factions}
        });
    }

    getCurrentEnding() {
        if (this.factions.establishment <= 10) return 'revolucion';
        if (this.factions.poblacion >= 80) return 'apoyo_masivo';
        return 'continua_lucha';
    }
}
