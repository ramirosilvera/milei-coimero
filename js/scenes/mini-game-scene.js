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
    
    // Fondo arcade con la imagen "fondo_arcade"
    const bg = this.add.image(camWidth / 2, camHeight / 2, 'fondo_arcade');
    bg.setDisplaySize(camWidth, camHeight);
    bg.setAlpha(0.9);
    
    // Overlay para mejorar visibilidad
    this.add.rectangle(camWidth / 2, camHeight / 2, camWidth, camHeight, 0x000000, 0.3);
    
    // Configurar límites del mundo
    this.physics.world.setBounds(0, 0, camWidth, camHeight);
    
    // Crear container para Milei (jugador)
    this.playerContainer = this.add.container(100, camHeight - 100);
    this.playerSprite = this.physics.add.sprite(0, 0, 'milei');
    this.playerSprite.setCollideWorldBounds(true);
    this.playerSprite.setBounce(0.2);
    this.playerSprite.setScale(0.4); // Tamaño intermedio, un poco más pequeño
    this.playerContainer.add(this.playerSprite);
    
    // Controles de teclado
    this.cursors = this.input.keyboard.createCursorKeys();
    
    // Controles on-screen para móviles
    this.createOnScreenControls();
    
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
    // Enemigo más grande y más lento que Milei
    this.enemySprite.setVelocityX(-50);
    this.enemySprite.setScale(0.6);
    this.enemyContainer.add(this.enemySprite);
    
    // Crear container para monedas (grupo físico)
    this.coins = this.physics.add.group();
    this.coinsCollected = 0;
    this.coinTarget = 3; // Solo se requieren 3 monedas para ganar
    // Indicador de monedas faltantes
    this.coinIndicator = this.add.text(camWidth - 150, 20, "Faltan: 3", { fontSize: '28px', fill: '#fff' })
      .setOrigin(0.5).setShadow(2,2,"#000",2,true,true);
    
    // Colisiones y overlaps
    this.physics.add.overlap(this.playerSprite, this.coins, this.collectCoin, null, this);
    this.physics.add.overlap(this.playerSprite, this.enemySprite, this.hitEnemy, null, this);
    
    // Generar monedas periódicamente
    this.coinTimer = this.time.addEvent({
      delay: 1000,
      callback: this.spawnCoin,
      callbackScope: this,
      loop: true
    });
    
    // Timeout del minijuego (30 segundos)
    this.time.delayedCall(30000, () => { if (!this.challengeSuccess) this.finishGame(); });
  }
  
  update() {
    // Controles de teclado
    if (this.cursors.left.isDown || this.leftPressed) {
      this.playerSprite.setVelocityX(-160);
      this.playerSprite.flipX = true;
    } else if (this.cursors.right.isDown || this.rightPressed) {
      this.playerSprite.setVelocityX(160);
      this.playerSprite.flipX = false;
    } else {
      this.playerSprite.setVelocityX(0);
    }
    if ((this.cursors.up.isDown || this.jumpPressed) && this.playerSprite.body.touching.down) {
      // Permitir un salto alto para alcanzar monedas
      this.playerSprite.setVelocityY(-500);
    }
  }
  
  spawnCoin() {
    const camWidth = this.cameras.main.width;
    const camHeight = this.cameras.main.height;
    const x = Phaser.Math.Between(50, camWidth - 50);
    const y = Phaser.Math.Between(50, camHeight - 150);
    const coin = this.coins.create(x, y, 'coin');
    coin.setScale(0.2); // Monedas más pequeñas
    coin.body.setAllowGravity(false);
    // Animación de rotación
    this.tweens.add({
      targets: coin,
      angle: 360,
      duration: 1000,
      repeat: -1
    });
    // La moneda se destruye después de 5 segundos si no se recoge
    this.time.delayedCall(5000, () => { if (coin.active) coin.destroy(); });
  }
  
  collectCoin(player, coin) {
    this.sound.play('click');
    coin.destroy();
    this.coinsCollected++;
    let faltan = Math.max(0, this.coinTarget - this.coinsCollected);
    this.coinIndicator.setText("Faltan: " + faltan);
    if (this.coinsCollected >= this.coinTarget) {
      // Indicar que el enemigo está vulnerable
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
    this.coinTimer.remove();
    this.input.keyboard.shutdown();
    this.physics.pause();
    if (this.arcadeMusic) {
      this.arcadeMusic.stop();
    }
    this.cameras.main.fade(500, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      const nextNode = this.challengeSuccess ? "final_exito" : "final_fracaso";
      const factionSystem = this.registry.get('currentFaction') || {};
      this.scene.start('NarrativeScene', { currentNode: nextNode, factionSystem: factionSystem });
    });
  }
  
  createOnScreenControls() {
    const camWidth = this.cameras.main.width;
    const camHeight = this.cameras.main.height;
    this.leftPressed = false;
    this.rightPressed = false;
    this.jumpPressed = false;
    
    // Botón izquierda
    const leftBtn = this.add.text(30, camHeight - 50, '<', { fontSize: '32px', fill: '#fff' })
      .setInteractive({ useHandCursor: true });
    leftBtn.on('pointerdown', () => { this.leftPressed = true; });
    leftBtn.on('pointerup', () => { this.leftPressed = false; });
    leftBtn.on('pointerout', () => { this.leftPressed = false; });
    
    // Botón derecha
    const rightBtn = this.add.text(80, camHeight - 50, '>', { fontSize: '32px', fill: '#fff' })
      .setInteractive({ useHandCursor: true });
    rightBtn.on('pointerdown', () => { this.rightPressed = true; });
    rightBtn.on('pointerup', () => { this.rightPressed = false; });
    rightBtn.on('pointerout', () => { this.rightPressed = false; });
    
    // Botón salto
    const jumpBtn = this.add.text(camWidth - 80, camHeight - 50, '↑', { fontSize: '32px', fill: '#fff' })
      .setInteractive({ useHandCursor: true });
    jumpBtn.on('pointerdown', () => { this.jumpPressed = true; });
    jumpBtn.on('pointerup', () => { this.jumpPressed = false; });
    jumpBtn.on('pointerout', () => { this.jumpPressed = false; });
    
    [leftBtn, rightBtn, jumpBtn].forEach(btn => {
      btn.setBackgroundColor('#222').setPadding(10);
    });
  }
}
