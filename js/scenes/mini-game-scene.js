export default class MiniGameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MiniGameScene' });
  }
  
  init(data) {
    // gameType: "radical", "peronist", "judge"
    this.gameType = data.gameType;
  }
  
  create() {
    const camWidth = this.cameras.main.width;
    const camHeight = this.cameras.main.height;
    const bg = this.add.image(camWidth / 2, camHeight / 2, 'congress_bg');
    bg.setDisplaySize(camWidth, camHeight);
    bg.setAlpha(0.9);
    
    this.challengeSuccess = false;
    this.coinCount = 0;
    this.coinTarget = 10; // Número de monedas necesarias para ganar
    
    // Instrucciones según el minijuego
    let instructions = "";
    let enemyKey = "";
    if (this.gameType === "radical") {
      instructions = "Radicales: Recoge monedas para debilitar a los legisladores radicales.";
      enemyKey = "radical_enemy";
    } else if (this.gameType === "peronist") {
      instructions = "Peronistas: Recoge monedas para comprar a los legisladores peronistas.";
      enemyKey = "peronist_enemy";
    } else if (this.gameType === "judge") {
      instructions = "Jueces: Recoge monedas para asignar jueces por decreto.";
      enemyKey = "judge_enemy";
    }
    
    // Overlay de instrucciones
    this.add.rectangle(camWidth / 2, 80, camWidth, 60, 0x000000, 0.7);
    this.add.text(camWidth / 2, 80, instructions, { fontSize: '28px', fill: '#fff', align: 'center' })
      .setOrigin(0.5).setShadow(2,2,"#000",2,true,true);
    
    // Mostrar el enemigo en la parte superior
    this.enemy = this.add.image(camWidth / 2, 150, enemyKey);
    this.enemy.setScale(0.5);
    
    // Grupo para monedas
    this.coinsCollected = 0;
    this.coinText = this.add.text(camWidth - 200, 50, "Monedas: 0", { fontSize: '28px', fill: '#fff' })
      .setOrigin(0.5).setShadow(2,2,"#000",2,true,true);
    
    // Generar monedas periódicamente
    this.coinTimer = this.time.addEvent({
      delay: 1000,
      callback: this.spawnCoin,
      callbackScope: this,
      loop: true
    });
    
    // Timeout del minijuego
    this.time.delayedCall(30000, () => { if (!this.challengeSuccess) this.finishGame(); });
  }
  
  spawnCoin() {
    const camWidth = this.cameras.main.width;
    const camHeight = this.cameras.main.height;
    // Crear una moneda en posición aleatoria
    const x = Phaser.Math.Between(50, camWidth - 50);
    const y = Phaser.Math.Between(150, camHeight - 50);
    const coin = this.add.image(x, y, 'coin').setInteractive({ useHandCursor: true });
    coin.setScale(0.5);
    
    // Animación simple (rotación)
    this.tweens.add({
      targets: coin,
      angle: 360,
      duration: 1000,
      repeat: -1
    });
    
    coin.on('pointerdown', () => {
      this.sound.play('click');
      coin.destroy();
      this.coinsCollected++;
      this.coinText.setText("Monedas: " + this.coinsCollected);
      // Si alcanza el umbral, se gana el minijuego
      if (this.coinsCollected >= this.coinTarget) {
        this.challengeSuccess = true;
        this.finishGame();
      }
    });
    
    // La moneda desaparece después de 5 segundos si no se toca
    this.time.delayedCall(5000, () => { if (coin.active) coin.destroy(); });
  }
  
  finishGame() {
    this.coinTimer.remove();
    this.input.removeAllListeners();
    this.cameras.main.fade(500, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      const nextNode = this.registry.get('nextNode') || "start";
      const factionSystem = this.registry.get('currentFaction');
      this.scene.start('NarrativeScene', { currentNode: nextNode, factionSystem });
    });
  }
}
