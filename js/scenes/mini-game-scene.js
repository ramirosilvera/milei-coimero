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
    
    // Fondo arcade usando "fondo_arcade.jpg"
    const bg = this.add.image(camWidth / 2, camHeight / 2, 'fondo_arcade');
    bg.setDisplaySize(camWidth, camHeight);
    bg.setAlpha(0.9);
    
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
    
    // Controles de teclado
    this.cursors = this.input.keyboard.createCursorKeys();
    
    // Crear controles on-screen para móviles
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
    // Enemigo más grande y mucho más lento
    this.enemySprite.setVelocityX(-50);
    this.enemySprite.setScale(0.3);
    this.enemyContainer.add(this.enemySprite);
    
    // Crear grupo de monedas
    this.coins = this.physics.add.group();
    this.coinsCollected = 0;
    this.coinTarget = 3; // Se necesitan 3 monedas para que el enemigo se vuelva vulnerable
    // Indicador de monedas restantes
    this.coinIndicator = this.add.text(camWidth - 150, 20, "Faltan: " + this.coinTarget, {
      fontSize: '28px',
      fill: '#fff'
    }).setOrigin(0.5).setShadow(2,2,"#000",2,true,true);
    
    // Colisiones: jugador vs monedas y jugador vs enemigo
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
  // Controles de teclado y on-screen
  if (this.cursors.left.isDown || this.leftPressed) {
    this.playerSprite.setVelocityX(-160);
    this.playerSprite.flipX = true;
  } else if (this.cursors.right.isDown || this.rightPressed) {
    this.playerSprite.setVelocityX(160);
    this.playerSprite.flipX = false;
  } else {
    this.playerSprite.setVelocityX(0);
  }
  // Usar body.blocked.down para detectar contacto con el suelo
  if ((this.cursors.up.isDown || this.jumpPressed) && this.playerSprite.body.blocked.down) {
    this.playerSprite.setVelocityY(-600);
  }
}
  
  spawnCoin() {
    const camWidth = this.cameras.main.width;
    const camHeight = this.cameras.main.height;
    const x = Phaser.Math.Between(50, camWidth - 50);
    const y = Phaser.Math.Between(50, camHeight - 150);
    const coin = this.coins.create(x, y, 'coin');
    coin.setScale(0.3); // Monedas más pequeñas
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
    const faltan = Math.max(0, this.coinTarget - this.coinsCollected);
    this.coinIndicator.setText("Faltan: " + faltan);
    if (this.coinsCollected >= this.coinTarget) {
      // Hacer que el enemigo se vuelva vulnerable
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
    const leftBtn = this.add.text(20, camHeight - 80, '<', {
      fontSize: '48px', fill: '#fff', backgroundColor: '#333', padding: { x: 20, y: 10 }
    })
      .setInteractive({ useHandCursor: true })
      .setScrollFactor(0)
      .setDepth(10);
    leftBtn.on('pointerdown', () => { this.leftPressed = true; leftBtn.setStyle({ fill: '#ff0' }); });
    leftBtn.on('pointerup', () => { this.leftPressed = false; leftBtn.setStyle({ fill: '#fff' }); });
    leftBtn.on('pointerout', () => { this.leftPressed = false; leftBtn.setStyle({ fill: '#fff' }); });
    
    // Botón derecha
    const rightBtn = this.add.text(100, camHeight - 80, '>', {
      fontSize: '48px', fill: '#fff', backgroundColor: '#333', padding: { x: 20, y: 10 }
    })
      .setInteractive({ useHandCursor: true })
      .setScrollFactor(0)
      .setDepth(10);
    rightBtn.on('pointerdown', () => { this.rightPressed = true; rightBtn.setStyle({ fill: '#ff0' }); });
    rightBtn.on('pointerup', () => { this.rightPressed = false; rightBtn.setStyle({ fill: '#fff' }); });
    rightBtn.on('pointerout', () => { this.rightPressed = false; rightBtn.setStyle({ fill: '#fff' }); });
    
// Botón salto (más visible, etiqueta SALTAR)
const jumpBtn = this.add.text(camWidth - 20, camHeight - 80, 'SALTAR', {
  fontSize: '48px', fill: '#fff', backgroundColor: '#333', padding: { x: 20, y: 10 }
})
  .setOrigin(1, 0)
  .setInteractive({ useHandCursor: true })
  .setScrollFactor(0)
  .setDepth(10);
jumpBtn.on('pointerdown', () => { this.jumpPressed = true; jumpBtn.setStyle({ fill: '#ff0' }); });
jumpBtn.on('pointerup', () => { this.jumpPressed = false; jumpBtn.setStyle({ fill: '#fff' }); });
jumpBtn.on('pointerout', () => { this.jumpPressed = false; jumpBtn.setStyle({ fill: '#fff' }); });
  }
}
