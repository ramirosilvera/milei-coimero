// Función auxiliar para transiciones con fade out
function fadeOutAndStart(scene, targetScene, data = {}) {
  scene.cameras.main.fadeOut(500, 0, 0, 0);
  scene.cameras.main.once('camerafadeoutcomplete', () => {
    scene.scene.start(targetScene, data);
  });
}

// BootScene: Carga de assets con mensajes de depuración.
class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }
  
  preload() {
    console.log("BootScene: Cargando assets...");
    // Imágenes
    this.load.image('menuBg', 'assets/images/menu_bg.jpg');
    this.load.image('congressBg', 'assets/images/congress_bg.jpg');
    this.load.image('milei', 'assets/images/milei.png');
    this.load.image('voteIcon', 'assets/images/vote_icon.png');
    this.load.image('boicotIcon', 'assets/images/boicot_icon.png');
    this.load.image('debateIcon', 'assets/images/debate_icon.png');
    this.load.image('successBg', 'assets/images/success_bg.jpg');
    this.load.image('failureBg', 'assets/images/failure_bg.jpg');
    
    // Sonidos
    this.load.audio('bgMusic', 'assets/sounds/background.mp3');
    this.load.audio('clickSound', 'assets/sounds/click.wav');
    this.load.audio('successSound', 'assets/sounds/success.wav');
    this.load.audio('failureSound', 'assets/sounds/failure.wav');
    this.load.audio('debateAmbience', 'assets/sounds/debate.mp3');
    this.load.audio('boicotSound', 'assets/sounds/boicot.wav');
  }
  
  create() {
    console.log("BootScene: Assets cargados. Iniciando MenuScene...");
    this.scene.start('MenuScene');
  }
}

// MenuScene: Menú principal con contenedores y animaciones de entrada.
class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }
  
  create() {
    console.log("MenuScene: Iniciando...");
    let menuContainer = this.add.container(0, 0);
    
    // Fondo del menú
    let bg = this.add.image(400, 300, 'menuBg').setDisplaySize(800,600);
    bg.setAlpha(0.85);
    menuContainer.add(bg);
    
    // Caja para el título
    let titleBg = this.add.rectangle(400, 150, 600, 70, 0x000000, 0.6);
    menuContainer.add(titleBg);
    let title = this.add.text(400, 150, 'Milei: La Jugada Cripto', { fontSize: '36px', fill: '#fff' });
    title.setOrigin(0.5);
    menuContainer.add(title);
    
    // Botón "Iniciar Juego" con animación de rebote al interactuar
    let buttonBg = this.add.rectangle(400, 300, 250, 60, 0x000000, 0.6);
    menuContainer.add(buttonBg);
    let startButton = this.add.text(400, 300, 'Iniciar Juego', { fontSize: '30px', fill: '#0f0' })
      .setInteractive({ useHandCursor: true });
    startButton.setOrigin(0.5);
    startButton.on('pointerover', () => {
      startButton.setStyle({ fill: '#ff0' });
      this.tweens.add({
        targets: startButton,
        scale: 1.1,
        duration: 150,
        yoyo: true
      });
    });
    startButton.on('pointerout', () => startButton.setStyle({ fill: '#0f0' }));
    startButton.on('pointerdown', () => {
      this.sound.play('clickSound');
      fadeOutAndStart(this, 'StoryScene');
    });
    menuContainer.add(startButton);
    
    // Animación de entrada del contenedor
    menuContainer.alpha = 0;
    this.tweens.add({
      targets: menuContainer,
      alpha: 1,
      duration: 800
    });
    
    // Música de fondo
    let music = this.sound.add('bgMusic', { loop: true, volume: 0.5 });
    if (!music.isPlaying) { music.play(); }
  }
}

// StoryScene: Narrativa ampliada con caja de texto animada.
class StoryScene extends Phaser.Scene {
  constructor() {
    super({ key: 'StoryScene' });
  }
  
  create() {
    console.log("StoryScene: Iniciando...");
    let storyContainer = this.add.container(0, 0);
    
    // Fondo con imagen del congreso
    let bg = this.add.image(400, 300, 'congressBg').setDisplaySize(800,600);
    bg.setAlpha(0.85);
    storyContainer.add(bg);
    
    // Caja para la narrativa
    let textBox = this.add.rectangle(400, 230, 750, 180, 0x000000, 0.65);
    storyContainer.add(textBox);
    
    const storyText = "El token Libra ha generado controversia y desconfianza. Milei, en medio del escándalo cripto, descubre que la comisión investigadora del Congreso está a punto de aprobarse. Decidido a frenar el proceso, planifica una estrategia audaz: un boicot radical o una intervención sutil que altere el debate. Cada decisión que tomes definirá el destino de su jugada y la estabilidad política del país.";
    let narrative = this.add.text(60, 160, storyText, { fontSize: '20px', fill: '#fff', wordWrap: { width: 680 } });
    storyContainer.add(narrative);
    
    // Botón "Continuar"
    let buttonBg = this.add.rectangle(400, 500, 220, 60, 0x000000, 0.6);
    storyContainer.add(buttonBg);
    let continueButton = this.add.text(400, 500, 'Continuar', { fontSize: '28px', fill: '#0f0' })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
          this.sound.play('clickSound');
          fadeOutAndStart(this, 'DecisionScene');
      });
    continueButton.setOrigin(0.5);
    storyContainer.add(continueButton);
    
    // Animación de entrada
    storyContainer.alpha = 0;
    this.tweens.add({
      targets: storyContainer,
      alpha: 1,
      duration: 800
    });
  }
}

// DecisionScene: Escena para elegir la estrategia con feedback visual.
class DecisionScene extends Phaser.Scene {
  constructor() {
    super({ key: 'DecisionScene' });
  }
  
  create() {
    console.log("DecisionScene: Iniciando...");
    let decisionContainer = this.add.container(0, 0);
    
    let bgRect = this.add.rectangle(400, 300, 800, 600, 0x222222, 1);
    decisionContainer.add(bgRect);
    
    let title = this.add.text(400, 80, 'Elige la estrategia de Milei:', { fontSize: '30px', fill: '#fff' });
    title.setOrigin(0.5);
    decisionContainer.add(title);
    
    // Opción 1: Boicot Radical
    let option1Bg = this.add.rectangle(400, 180, 350, 60, 0x000000, 0.6);
    decisionContainer.add(option1Bg);
    let option1 = this.add.text(400, 180, '1. Boicot Radical', { fontSize: '28px', fill: '#0f0' })
      .setInteractive({ useHandCursor: true });
    option1.setOrigin(0.5);
    option1.on('pointerover', () => {
      option1.setStyle({ fill: '#ff0' });
      this.tweens.add({ targets: option1, scale: 1.05, duration: 100, yoyo: true });
    });
    option1.on('pointerout', () => option1.setStyle({ fill: '#0f0', scale: 1 }));
    option1.on('pointerdown', () => {
      this.sound.play('clickSound');
      this.registry.set('strategy', 'boicot');
      fadeOutAndStart(this, 'MiniGameScene');
    });
    decisionContainer.add(option1);
    
    // Opción 2: Intervención Sutil
    let option2Bg = this.add.rectangle(400, 260, 350, 60, 0x000000, 0.6);
    decisionContainer.add(option2Bg);
    let option2 = this.add.text(400, 260, '2. Intervención Sutil', { fontSize: '28px', fill: '#0f0' })
      .setInteractive({ useHandCursor: true });
    option2.setOrigin(0.5);
    option2.on('pointerover', () => {
      option2.setStyle({ fill: '#ff0' });
      this.tweens.add({ targets: option2, scale: 1.05, duration: 100, yoyo: true });
    });
    option2.on('pointerout', () => option2.setStyle({ fill: '#0f0', scale: 1 }));
    option2.on('pointerdown', () => {
      this.sound.play('clickSound');
      this.registry.set('strategy', 'sutil');
      fadeOutAndStart(this, 'MiniGameScene');
    });
    decisionContainer.add(option2);
    
    decisionContainer.alpha = 0;
    this.tweens.add({
      targets: decisionContainer,
      alpha: 1,
      duration: 800
    });
  }
}

// MiniGameScene: Mini juego con íconos reducidos, animaciones y barra de progreso.
class MiniGameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MiniGameScene' });
  }
  
  create() {
    console.log("MiniGameScene: Iniciando...");
    const strategy = this.registry.get('strategy');
    let instruction = (strategy === 'boicot') ? 
      '¡Haz clic en los pequeños íconos de voto para bloquear la votación!' : 
      '¡Haz clic en los íconos clave para influir en el debate y evita distracciones!';
    
    let miniGameContainer = this.add.container(0, 0);
    let instructionBg = this.add.rectangle(400, 30, 750, 40, 0x000000, 0.6);
    miniGameContainer.add(instructionBg);
    let instructionText = this.add.text(400, 30, instruction, { fontSize: '22px', fill: '#fff' });
    instructionText.setOrigin(0.5);
    miniGameContainer.add(instructionText);
    
    // Puntaje
    this.score = 0;
    this.scoreText = this.add.text(20, 20, 'Puntos: 0', { fontSize: '24px', fill: '#fff' });
    miniGameContainer.add(this.scoreText);
    
    // Barra de progreso (tiempo restante)
    this.progressBar = this.add.rectangle(400, 570, 760, 20, 0x0f0f0f, 0.8);
    miniGameContainer.add(this.progressBar);
    
    // Contenedor para los íconos
    this.iconsContainer = this.add.container(0, 0);
    
    // Temporizador de 12 segundos
    this.gameTime = 12000;
    this.startTime = this.time.now;
    
    this.time.delayedCall(this.gameTime, () => {
      fadeOutAndStart(this, 'EndScene', { score: this.score, strategy: strategy });
    });
    
    // Evento para generar íconos cada 700 ms
    this.time.addEvent({
      delay: 700,
      callback: () => { this.spawnIcon(strategy); },
      loop: true
    });
  }
  
  update() {
    // Actualizar barra de progreso
    let elapsed = this.time.now - this.startTime;
    let progress = Phaser.Math.Clamp(1 - elapsed / this.gameTime, 0, 1);
    this.progressBar.width = 760 * progress;
  }
  
  spawnIcon(strategy) {
    let iconKey = (strategy === 'boicot') ? 'voteIcon' : 'debateIcon';
    let x = Phaser.Math.Between(50, 750);
    let y = Phaser.Math.Between(80, 550);
    let icon = this.add.sprite(x, y, iconKey).setInteractive();
    icon.setScale(0.6);
    this.iconsContainer.add(icon);
    
    icon.on('pointerdown', () => {
      this.sound.play('clickSound', { volume: 0.7 });
      this.score++;
      this.scoreText.setText('Puntos: ' + this.score);
      this.tweens.add({
        targets: icon,
        scale: 0,
        duration: 200,
        onComplete: () => icon.destroy()
      });
    });
    
    // Animación de rotación
    this.tweens.add({
      targets: icon,
      angle: 360,
      duration: 1200,
      ease: 'Linear'
    });
    
    // Eliminar el ícono tras 1.2 segundos si no se clickea
    this.time.delayedCall(1200, () => {
      if (icon && icon.active) { icon.destroy(); }
    });
  }
}

// EndScene: Escena final con contenedores, mensaje y botón de reinicio.
class EndScene extends Phaser.Scene {
  constructor() {
    super({ key: 'EndScene' });
  }
  
  init(data) {
    this.finalScore = data.score;
    this.strategy = data.strategy;
  }
  
  create() {
    console.log("EndScene: Iniciando...");
    let endContainer = this.add.container(0, 0);
    
    let bgKey = (this.finalScore >= 30) ? 'successBg' : 'failureBg';
    let bg = this.add.image(400, 300, bgKey).setDisplaySize(800,600);
    bg.setAlpha(0.9);
    endContainer.add(bg);
    
    let resultBg = this.add.rectangle(400, 280, 750, 100, 0x000000, 0.65);
    endContainer.add(resultBg);
    
    let resultText = '';
    if (this.strategy === 'boicot') {
      resultText = (this.finalScore >= 30) ? 
        '¡Gran éxito! El boicot radical de Milei paralizó la votación y su estrategia sacudió al Congreso.' : 
        'El boicot no fue suficiente. La votación continuó y las consecuencias se hicieron notar.';
    } else {
      resultText = (this.finalScore >= 30) ? 
        'La intervención sutil cambió el curso del debate, consolidando a Milei como un estratega astuto.' : 
        'La influencia encubierta fracasó. El debate se volvió caótico y la situación empeoró.';
    }
    
    let result = this.add.text(400, 280, resultText, { fontSize: '24px', fill: '#fff', wordWrap: { width: 700 } });
    result.setOrigin(0.5);
    endContainer.add(result);
    
    let buttonBg = this.add.rectangle(400, 500, 250, 60, 0x000000, 0.6);
    endContainer.add(buttonBg);
    let restartButton = this.add.text(400, 500, 'Reiniciar Juego', { fontSize: '28px', fill: '#0f0' })
      .setInteractive({ useHandCursor: true });
    restartButton.setOrigin(0.5);
    restartButton.on('pointerdown', () => {
      this.sound.play('clickSound');
      fadeOutAndStart(this, 'MenuScene');
    });
    endContainer.add(restartButton);
    
    if (this.finalScore >= 30) {
      this.sound.play('successSound');
    } else {
      this.sound.play('failureSound');
    }
    
    endContainer.alpha = 0;
    this.tweens.add({
      targets: endContainer,
      alpha: 1,
      duration: 800
    });
  }
}

// Configuración final de Phaser.
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  backgroundColor: '#000000',
  scene: [BootScene, MenuScene, StoryScene, DecisionScene, MiniGameScene, EndScene],
  audio: { disableWebAudio: false }
};

const game = new Phaser.Game(config);
