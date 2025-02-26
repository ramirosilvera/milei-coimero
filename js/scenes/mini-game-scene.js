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
    
    // Reproducir música de fondo arcade
    this.arcadeMusic = this.sound.add('arcade_bg', { volume: 0.5, loop: true });
    this.arcadeMusic.play();
    
    // Fondo arcade usando la imagen fondo_arcade
    const bg = this.add.image(camWidth / 2, camHeight / 2, 'fondo_arcade');
    bg.setDisplaySize(camWidth, camHeight);
    
    // Overlay de leve oscuridad
    this.add.rectangle(camWidth / 2, camHeight / 2, camWidth, camHeight, 0x000000, 0.3);
    
    // Configurar límites del mundo
    this.physics.world.setBounds(0, 0, camWidth, camHeight);
    
    // Crear container para Milei (jugador)
    this.playerContainer = this.add.container(100, camHeight - 100);
    this.playerSprite = this.physics.add.sprite(0, 0, 'milei');
    this.playerSprite.setCollideWorldBounds(true);
    this.playerSprite.setBounce(0.2);
    this.playerSprite.setScale(0.5); // Tamaño intermedio
    this.playerContainer.add(this.playerSprite);
    
    // Controles del jugador
    this.cursors = this.input.keyboard.createCursorKeys();
    
    // Crear container para el enemigo
    let enemyKey = "";
    if (this.gameType === "radical") {
      enemyKey = "radical_enemy";
    } else if (this.gameType === "peronist") {
      enemyKey = "peronist_enemy";
    } else if (this.gameType === "judge") {
      enemyKey = "judge_enemy";
    }
    this.enemyContainer = this.add.container(camWidth - 100, camHeight - 100);
    this.enemySprite = this.physics.add.sprite(0, 0, enemyKey);
    this.enemySprite.setCollideWorldBounds(true);
    this.enemySprite.setBounce(1);
    // Velocidad lenta (por ejemplo, 80 en comparación con 160 del jugador)
    this.enemySprite.setVelocityX(-80);
    this.enemySprite.setScale(0.8); // Más grande que Milei
    this.enemyContainer.add(this.enemySprite);
    
    // Crear container para monedas (grupo)
    this.coinContainer = this.add.container(0, 0);
    this.coinsCollected = 0;
    this.coinTarget = 10;
    this.coinText = this.add.text(camWidth - 150, 20, "Monedas: 0", { fontSize: '28px', fill: '#fff' })
      .setShadow(2,2,"#000",2,true,true);
    
    // Configurar colisiones: se usarán las físicas de los sprites dentro de los containers.
    this.physics.add.overlap(this.playerSprite, this.coinContainer.list, this.collectCoin, null, this);
    this.physics.add.overlap(this.playerSprite, this.enemySprite, this.hitEnemy, null, this);
    
    // Timer para generar monedas periódicamente
    this.coinTimer = this.time.addEvent({
      delay: 1000,
      callback: this.spawnCoin,
      callbackScope: this,
      loop: true
    });
    
    // Tiempo máximo para el minijuego (30 segundos)
    this.time.delayedCall(30000, () => { if (!this.challengeSuccess) this.finishGame(); });
  }
  
  update() {
    // Controles básicos para mover a Milei
    if (this.cursors.left.isDown) {
      this.playerSprite.setVelocityX(-160);
      this.playerSprite.flipX = true;
    } else if (this.cursors.right.isDown) {
      this.playerSprite.setVelocityX(160);
      this.playerSprite.flipX = false;
    } else {
      this.playerSprite.setVelocityX(0);
    }
    if (this.cursors.up.isDown && this.playerSprite.body.touching.down) {
      this.playerSprite.setVelocityY(-330);
    }
  }
  
  spawnCoin() {
    const camWidth = this.cameras.main.width;
    const camHeight = this.cameras.main.height;
    // Posición aleatoria dentro del área jugable
    const x = Phaser.Math.Between(50, camWidth - 50);
    const y = Phaser.Math.Between(50, camHeight - 150);
    // Crear sprite de moneda
    const coinSprite = this.physics.add.sprite(x, y, 'coin');
    coinSprite.setScale(0.3); // Monedas más pequeñas
    coinSprite.body.setAllowGravity(false);
    // Agregar la moneda al container de monedas (esto es solo organizativo)
    this.coinContainer.add(coinSprite);
    // Animación: rotación continua
    this.tweens.add({
      targets: coinSprite,
      angle: 360,
      duration: 1000,
      repeat: -1
    });
    // La moneda se destruye después de 5 segundos si no es recogida
    this.time.delayedCall(5000, () => { if (coinSprite.active) coinSprite.destroy(); });
  }
  
  collectCoin(player, coin) {
    this.sound.play('click');
    coin.destroy();
    this.coinsCollected++;
    this.coinText.setText("Monedas: " + this.coinsCollected);
    // Si se recolectan suficientes monedas, el enemigo se vuelve vulnerable
    if (this.coinsCollected >= this.coinTarget) {
      this.enemySprite.setTint(0xff0000);
      this.enemySprite.vulnerable = true;
    }
  }
  
  hitEnemy(player, enemy) {
    if (enemy.vulnerable) {
      this.sound.play('success');
      enemy.destroy();
      this.challengeSuccess = true;
      this.finishGame();
    } else {
      this.sound.play('failure');
      this.challengeSuccess = false;
      this.finishGame();
    }
  }
  
  finishGame() {
    // Limpiar timers y detener controles
    this.coinTimer.remove();
    this.input.keyboard.shutdown();
    this.physics.pause();
    if (this.arcadeMusic) {
      this.arcadeMusic.stop();
    }
    this.cameras.main.fade(500, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      // Según el resultado del minijuego, se pasa a la narrativa final
      let nextNode = this.challengeSuccess ? "final_exito" : "final_fracaso";
      const factionSystem = this.registry.get('currentFaction') || {};
      this.scene.start('NarrativeScene', { currentNode: nextNode, factionSystem: factionSystem });
    });
  }
}
