export default class MiniGameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MiniGameScene' });
  }
  
  init(data) {
    // data.gameType indica el tipo de mini-juego ("boicot", "influencia" o "campaña")
    this.gameType = data.gameType;
  }
  
  create() {
    this.add.image(600, 400, 'congress_bg').setAlpha(0.9);
    this.challengeSuccess = false;
    
    if (this.gameType === "boicot") {
      this.createBoicotGame();
    } else if (this.gameType === "influencia") {
      this.createInfluenciaGame();
    } else if (this.gameType === "campaña") {
      this.createCampanaGame();
    }
  }
  
  // Mini-juego "Boicot": clic rápido en el objetivo, evitando distractores.
  createBoicotGame() {
    this.add.text(600, 50, 'Mini Juego: Boicot Radical', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
    this.target = this.add.sprite(600, 400, 'milei').setInteractive({ useHandCursor: true });
    this.target.alpha = 1;
    this.progress = 100;
    this.progressBar = this.add.graphics();
    this.drawProgressBar();
    
    // Partículas para efecto al hacer clic
    this.particles = this.add.particles('milei');
    this.emitter = this.particles.createEmitter({
      speed: { min: -100, max: 100 },
      scale: { start: 0.5, end: 0 },
      lifespan: 500,
      blendMode: 'ADD'
    });
    
    this.target.on('pointerdown', () => {
      this.sound.play('click');
      this.emitter.explode(10, this.target.x, this.target.y);
      let reduction = Phaser.Math.Between(8, 12);
      this.progress -= reduction;
      this.target.alpha -= 0.1;
      this.drawProgressBar();
      if (this.progress <= 0) {
        this.challengeSuccess = true;
        this.finishGame();
      }
    });
    
    // Distractores aleatorios
    this.time.addEvent({
      delay: 2000,
      callback: () => {
        const distractor = this.add.sprite(
          Phaser.Math.Between(100, 1100),
          Phaser.Math.Between(200, 600),
          'milei'
        ).setScale(0.5).setInteractive({ useHandCursor: true });
        distractor.alpha = 0.7;
        distractor.on('pointerdown', () => {
          this.sound.play('failure');
          this.progress += 10;
          this.drawProgressBar();
          distractor.destroy();
        });
        this.time.addEvent({ delay: 3000, callback: () => distractor.destroy() });
      },
      loop: true
    });
    
    // Timeout
    this.time.delayedCall(15000, () => { if (!this.challengeSuccess) this.finishGame(); });
  }
  
  // Mini-juego "Influencia": presionar la tecla correcta (aleatoria entre dos opciones).
  createInfluenciaGame() {
    this.add.text(600, 50, 'Mini Juego: Influencia Sutil', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
    this.requiredKeys = ['I', 'U'];
    this.currentKey = Phaser.Utils.Array.GetRandom(this.requiredKeys);
    this.keyText = this.add.text(600, 300, `Presiona: ${this.currentKey}`, { fontSize: '48px', fill: '#ff0' }).setOrigin(0.5);
    
    this.challengeTime = 10;
    this.timerText = this.add.text(600, 380, `Tiempo: ${this.challengeTime}`, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
    
    this.timeEvent = this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.challengeTime--;
        this.timerText.setText(`Tiempo: ${this.challengeTime}`);
        if (this.challengeTime <= 0) this.finishGame();
      },
      loop: true
    });
    
    this.input.keyboard.on('keydown', (event) => {
      if (event.key.toUpperCase() === this.currentKey) {
        this.sound.play('debate');
        this.tweens.add({
          targets: this.keyText,
          scale: 1.5,
          duration: 200,
          yoyo: true
        });
        this.challengeSuccess = true;
        this.timeEvent.remove();
        this.finishGame();
      }
    });
  }
  
  // Mini-juego "Campaña": prueba de sincronización de teclas en secuencia.
  createCampanaGame() {
    this.add.text(600, 50, 'Mini Juego: Campaña Medial', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
    this.requiredKeys = ['C', 'V'];
    this.sequence = Phaser.Utils.Array.Shuffle(this.requiredKeys.slice());
    this.sequenceIndex = 0;
    this.sequenceText = this.add.text(600, 300, `Secuencia: ${this.sequence.join(' ')}`, { fontSize: '40px', fill: '#ff0' }).setOrigin(0.5);
    this.promptText = this.add.text(600, 360, `Presiona: ${this.sequence[this.sequenceIndex]}`, { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
    
    this.input.keyboard.on('keydown', (event) => {
      if (event.key.toUpperCase() === this.sequence[this.sequenceIndex]) {
        this.sound.play('debate');
        this.sequenceIndex++;
        if (this.sequenceIndex < this.sequence.length) {
          this.promptText.setText(`Presiona: ${this.sequence[this.sequenceIndex]}`);
        } else {
          this.challengeSuccess = true;
          this.finishGame();
        }
      }
    });
    
    // Timeout para la secuencia
    this.time.delayedCall(15000, () => { if (!this.challengeSuccess) this.finishGame(); });
  }
  
  finishGame() {
    // Transición rápida y regreso a la narrativa.
    this.cameras.main.fade(500, 0, 0, 0);
    this.cameras.main.on('camerafadeoutcomplete', () => {
      // Recupera el nodo siguiente guardado en el registry
      const nextNode = this.registry.get('nextNode') || "start";
      // Recupera el sistema de facciones actual
      const factionSystem = this.registry.get('currentFaction');
      this.scene.start('NarrativeScene', { currentNode: nextNode, factionSystem });
    });
  }
}
