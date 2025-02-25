export default class MiniGameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MiniGameScene' });
  }
  
  init(data) {
    this.gameType = data.gameType;
  }
  
  create() {
    this.add.image(600, 400, 'congress_bg').setAlpha(0.9);
    this.challengeSuccess = false;
    
    // Mostrar overlay de instrucciones
    this.add.rectangle(600, 100, 1200, 100, 0x000000, 0.6);
    
    if (this.gameType === "boicot") {
      this.createBoicotGame();
    } else if (this.gameType === "influencia") {
      this.createInfluenciaGame();
    } else if (this.gameType === "campaña") {
      this.createCampanaGame();
    }
  }
  
  // Minijuego "Boicot": el objetivo se mueve y hay distractores.
  createBoicotGame() {
    this.add.text(600, 50, 'Minijuego: Boicot Radical', { fontSize: '32px', fill: '#fff' })
      .setOrigin(0.5).setShadow(2,2,"#000",2,true,true);
    
    // Objetivo móvil
    this.target = this.add.sprite(600, 400, 'milei').setInteractive({ useHandCursor: true });
    this.target.alpha = 1;
    this.tweens.add({
      targets: this.target,
      x: { value: 800, duration: 2000, ease: 'Sine.easeInOut', yoyo: true, repeat: -1 },
      y: { value: 500, duration: 3000, ease: 'Sine.easeInOut', yoyo: true, repeat: -1 }
    });
    
    this.progress = 100;
    this.progressBar = this.add.graphics();
    this.drawProgressBar();
    
    // Partículas al tocar el objetivo
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
      this.drawProgressBar();
      if (this.progress <= 0) {
        this.challengeSuccess = true;
        this.finishGame();
      }
    });
    
    // Distractores móviles
    this.time.addEvent({
      delay: 2500,
      callback: () => {
        const distractor = this.add.sprite(
          Phaser.Math.Between(100, 1100),
          Phaser.Math.Between(200, 600),
          'milei'
        ).setScale(0.5).setInteractive({ useHandCursor: true });
        distractor.alpha = 0.7;
        this.tweens.add({
          targets: distractor,
          x: { value: Phaser.Math.Between(100, 1100), duration: 1500, ease: 'Sine.easeInOut', yoyo: true, repeat: -1 },
          y: { value: Phaser.Math.Between(200, 600), duration: 2000, ease: 'Sine.easeInOut', yoyo: true, repeat: -1 }
        });
        distractor.on('pointerdown', () => {
          this.sound.play('failure');
          this.progress += 10;
          this.drawProgressBar();
          distractor.destroy();
        });
        this.time.delayedCall(3000, () => distractor.destroy());
      },
      loop: true
    });
    
    this.time.delayedCall(20000, () => { if (!this.challengeSuccess) this.finishGame(); });
  }
  
  // Minijuego "Influencia": slider que se mueve y el jugador debe detenerlo en una zona verde.
  createInfluenciaGame() {
    this.add.text(600, 50, 'Minijuego: Influencia Sutil', { fontSize: '32px', fill: '#fff' })
      .setOrigin(0.5).setShadow(2,2,"#000",2,true,true);
    
    // Barra de slider
    const sliderWidth = 600;
    const sliderX = 600 - sliderWidth/2;
    const sliderY = 400;
    this.add.rectangle(600, sliderY, sliderWidth, 30, 0x555555, 1);
    // Zona verde óptima
    const optimalZoneX = sliderX + sliderWidth * 0.4;
    const optimalZoneWidth = sliderWidth * 0.2;
    this.add.rectangle(optimalZoneX + optimalZoneWidth/2, sliderY, optimalZoneWidth, 30, 0x00ff00, 0.8);
    
    // Indicador que se mueve
    this.indicator = this.add.rectangle(sliderX, sliderY, 20, 40, 0xff0000);
    this.tweens.add({
      targets: this.indicator,
      x: { value: sliderX + sliderWidth, duration: 1500, ease: 'Linear', yoyo: true, repeat: -1 }
    });
    
    // Botón para detener el indicador
    const stopButton = this.add.text(600, 500, 'Detener', { fontSize: '32px', fill: '#0f0' })
      .setInteractive({ useHandCursor: true })
      .setOrigin(0.5)
      .setStyle({ padding: '10px', backgroundColor: '#222' });
      
    stopButton.on('pointerdown', () => {
      this.sound.play('click');
      // Detener el tween
      this.tweens.killTweensOf(this.indicator);
      // Comprobar si el indicador está en la zona óptima
      if (this.indicator.x >= optimalZoneX && this.indicator.x <= optimalZoneX + optimalZoneWidth) {
        this.challengeSuccess = true;
      }
      this.finishGame();
    });
    
    // Timeout
    this.time.delayedCall(15000, () => { if (!this.challengeSuccess) this.finishGame(); });
  }
  
  // Minijuego "Campaña": secuencia rítmica de toques en pantalla.
  createCampanaGame() {
    this.add.text(600, 50, 'Minijuego: Campaña Medial', { fontSize: '32px', fill: '#fff' })
      .setOrigin(0.5).setShadow(2,2,"#000",2,true,true);
      
    // Mostrar una secuencia de círculos que aparecen en posiciones aleatorias y el jugador debe tocarlos en orden.
    this.sequence = [];
    const sequenceLength = 4;
    for (let i = 0; i < sequenceLength; i++) {
      this.sequence.push({
        x: Phaser.Math.Between(200, 1000),
        y: Phaser.Math.Between(200, 600)
      });
    }
    this.currentIndex = 0;
    // Mostrar la secuencia (todos los círculos, con opacidad baja, que se iluminan cuando el jugador toca correctamente)
    this.circles = [];
    this.sequence.forEach((pos, idx) => {
      const circle = this.add.circle(pos.x, pos.y, 30, 0x00ff00, 0.3);
      this.circles.push(circle);
    });
    
    this.input.on('pointerdown', (pointer) => {
      // Comprobar si el toque está cerca del círculo correspondiente
      const target = this.sequence[this.currentIndex];
      const distance = Phaser.Math.Distance.Between(pointer.x, pointer.y, target.x, target.y);
      if (distance < 50) {
        this.sound.play('debate');
        this.circles[this.currentIndex].setFillStyle(0x00ff00, 1);
        this.currentIndex++;
        if (this.currentIndex >= this.sequence.length) {
          this.challengeSuccess = true;
          this.finishGame();
        }
      }
    });
    
    this.time.delayedCall(20000, () => { if (!this.challengeSuccess) this.finishGame(); });
  }
  
  finishGame() {
    this.cameras.main.fade(500, 0, 0, 0);
    this.cameras.main.on('camerafadeoutcomplete', () => {
      const nextNode = this.registry.get('nextNode') || "start";
      const factionSystem = this.registry.get('currentFaction');
      this.scene.start('NarrativeScene', { currentNode: nextNode, factionSystem });
    });
  }
  
  drawProgressBar() {
    this.progressBar.clear();
    this.progressBar.fillStyle(0x222222, 0.8);
    this.progressBar.fillRect(300, 750, 600, 20);
    this.progressBar.fillStyle(0xff0000, 1);
    let barWidth = 600 * (this.progress / 100);
    this.progressBar.fillRect(300, 750, barWidth, 20);
  }
}
