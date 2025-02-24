class NarrativeManager {
    constructor() {
        this.factions = {
            establishment: 50,
            libertarios: 30,
            medios: 40,
            academia: 50,
            poblacion: 60
        };
        
        this.decisions = [];
        this.currentStrategy = null;
    }

    applyDecision(decisionType) {
        const impacts = {
            boicot: {
                establishment: -25,
                libertarios: +20,
                poblacion: Phaser.Math.Between(-10, 10),
                medios: -15
            },
            sutil: {
                establishment: -10,
                academia: +15,
                medios: +20,
                poblacion: +5
            },
            media: {
                poblacion: +30,
                establishment: -5,
                libertarios: -10,
                medios: +25
            }
        };

        Object.entries(impacts[decisionType]).forEach(([faction, value]) => {
            this.factions[faction] = Phaser.Math.Clamp(this.factions[faction] + value, 0, 100);
        });

        this.currentStrategy = decisionType;
        this.decisions.push({
            type: decisionType,
            timestamp: Date.now(),
            factions: {...this.factions}
        });
    }

    getCurrentEnding() {
        if (this.factions.establishment <= 10) return 'revolucion_exitosa';
        if (this.factions.poblacion >= 80) return 'apoyo_masivo';
        if (this.factions.medios >= 70 && this.factions.academia <= 30) return 'control_mediatico';
        return 'situacion_inestable';
    }
}
