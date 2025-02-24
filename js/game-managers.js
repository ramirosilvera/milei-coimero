class NarrativeManager {
  constructor() {
    this.storyFlags = {
      publicOpinion: 50,
      congressionalSupport: 30,
      cryptoAllies: 0,
      keyDecisions: [],
      relationships: new Map()
    };
  }

  applyDecision(decision) {
    const effects = {
      'boicot': { congressionalSupport: -15, publicOpinion: 10 },
      'sutil': { cryptoAllies: 2, congressionalSupport: 5 },
      'media': { publicOpinion: 20, congressionalSupport: -10 }
    };
    
    Object.entries(effects[decision]).forEach(([key, val]) => {
      this.storyFlags[key] = Phaser.Math.Clamp(this.storyFlags[key] + val, 0, 100);
    });
    
    this.storyFlags.keyDecisions.push(decision);
  }

  getCurrentOutcome() {
    if (this.storyFlags.congressionalSupport <= 0) return 'victoria_absoluta';
    if (this.storyFlags.publicOpinion >= 70) return 'apoyo_popular';
    return 'continua_lucha';
  }
}

class GameState {
  constructor() {
    this.saveSlots = [null, null, null];
    this.currentSession = {
      decisions: [],
      timeline: [],
      resources: {
        influencia: 0,
        apoyoPopular: 50,
        criptoRecursos: 100
      }
    };
  }

  saveGame(slot) {
    this.saveSlots[slot] = JSON.parse(JSON.stringify(this.currentSession));
  }

  loadGame(slot) {
    if (this.saveSlots[slot]) {
      this.currentSession = JSON.parse(JSON.stringify(this.saveSlots[slot]));
    }
  }
}
