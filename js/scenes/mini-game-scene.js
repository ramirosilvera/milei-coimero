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
    
    // Fondo arcade: usar la imagen "fondo_arcade.jpg"
    const bg = this.add.image(camWidth / 2, camHeight / 2, 'fondo_arcade');
    bg.setDisplaySize(camWidth, camHeight);
    
    // Agregar un overlay de leve oscuridad para mejorar la visibilidad de los elementos
    this.add.rectangle(camWidth / 2, camHeight / 2, camWidth, camHeight, 0x000000, 0.3);
    
    // Configurar física del mundo y límites
    this.physics.world.setBounds(0, 0, camWidth, camHeight);
    
    // Crear el jugador: Milei
    this.player = this.physics.add.sprite(100, camHeight - 100, 'milei');
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0.2);
    this.player.setScale(0.5);
    
    // Controles
    this.cursors = this.input.keyboard.createCursorKeys();
    
    // Crear grupo de monedas
    this.coins = this.physics.add.group();
    this.coinsCollected = 0;
    this.coinTarget = 10;
    
    // Mostrar contador de monedas
    this.coinText = this.add.text(camWidth - 150, 20, "Monedas: 0", { fontSize: '28px', fill: '#fff' })
      .setShadow(2, 2, "#000", 2, true, true);
    
    // Generar monedas de forma periódica
    this.coinTimer = this.time.addEvent({
      delay: 1000,
      callback: this.spawnCoin,
      callbackScope: this,
      loop: true
    });
    
    // Crear enemigo según el gameType
    let enemyKey = "";
    if (this.gameType === "radical") {
      enemyKey = "radical_enemy";
    } else if (this.gameType === "peronist") {
      enemyKey = "peronist_enemy";
    } else if (this.gameType === "judge") {
      enemyKey = "judge_enemy";
    }
    this.enemy = this.physics.add.sprite(camWidth - 100, camHeight - 100, enemyKey);
    this.enemy.setCollideWorldBounds(true);
    this.enemy.setBounce(1);
    this.enemy.setVelocityX(-100);
    this.enemy.setScale(0.5);
    this.enemy.vulnerable = false;
    
    // Hacer que al recolectar suficientes monedas, el enemigo se vuelva vulnerable
    this.events.on('coinsUpdated', () => {
      if (this.coinsCollected >= this.coinTarget) {
        this.enemy.vulnerable = true;
        // Opción: hacer que el enemigo parpadee para indicar vulnerabilidad
        this.tweens.add({
          targets: this.enemy,
          alpha: { from: 1, to: 0.5 },
          duration: 300,
          yoyo: true,
          repeat: -1
        });
      }
    });
    
    // Colisiones y overlaps
    this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
    this.physics.add.overlap(this.player, this.enemy, this.hitEnemy, null, this);
    
    // Timeout del minijuego
    this.time.delayedCall(30000, () => { if (!this.challengeSuccess) this.finishGame(); });
  }
  
  update() {
    // Controles básicos de movimiento (izquierda, derecha y salto)
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      // Opcional: animación de caminar a la izquierda
      this.player.flipX = true;
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.flipX = false;
    } else {
      this.player.setVelocityX(0);
    }
    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }
  }
  
  spawnCoin() {
    const camWidth = this.cameras.main.width;
    const camHeight = this.cameras.main.height;
    // Posición aleatoria dentro de la zona jugable
    const x = Phaser.Math.Between(50, camWidth - 50);
    const y = Phaser.Math.Between(50, camHeight - 150);
    const coin = this.coins.create(x, y, 'coin');
    coin.setScale(0.5);
    coin.setCollideWorldBounds(true);
    coin.body.setAllowGravity(false);
    // Animación de rotación
    this.tweens.add({
      targets: coin,
      angle: 360,
      duration: 1000,
      repeat: -1
    });
    
    // La moneda se autodestruye después de 5 segundos si no se recoge
    this.time.delayedCall(5000, () => { if (coin.active) coin.destroy(); });
  }
  
  collectCoin(player, coin) {
    this.sound.play('click');
    coin.destroy();
    this.coinsCollected++;
    this.coinText.setText("Monedas: " + this.coinsCollected);
    this.events.emit('coinsUpdated');
  }
  
  hitEnemy(player, enemy) {
    if (enemy.vulnerable) {
      // Si el enemigo está vulnerable, derrotarlo
      this.sound.play('success');
      enemy.destroy();
      this.challengeSuccess = true;
      this.finishGame();
    } else {
      // Si no, el jugador pierde (puedes implementar efectos o reinicio)
      this.sound.play('failure');
      this.challengeSuccess = false;
      this.finishGame();
    }
  }
  
  finishGame() {
    this.coinTimer.remove();
    this.input.keyboard.shutdown();
    this.physics.pause();
    this.cameras.main.fade(500, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      const nextNode = this.registry.get('nextNode') || "start";
      const factionSystem = this.registry.get('currentFaction');
      this.scene.start('NarrativeScene', { currentNode: nextNode, factionSystem });
    });
  }
}
