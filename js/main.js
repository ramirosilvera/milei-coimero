// BootScene: carga de assets y mensajes de depuración.
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

// MenuScene: Menú principal con contenedores y estilos mejorados.
class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }
  
  create() {
    console.log("MenuScene: Iniciando...");
    let menuContainer = this.add.container(0, 0);
    
    // Fondo del menú con transparencia
    let bg = this.add.image(400, 300, 'menuBg').setDisplaySize(800,600);
    bg.setAlpha(0.85);
    menuContainer.add(bg);
    
    // Caja semitransparente para el título
    let titleBg = this.add.rectangle(400, 150, 600, 70, 0x000000, 0.6);
    menuContainer.add(titleBg);
    let title = this.add.text(400, 150, 'Milei: La Jugada Cripto', { fontSize: '36px', fill: '#fff' });
    title.setOrigin(0.5);
    menuContainer.add(title);
    
    // Botón "Iniciar Juego"
    let buttonBg = this.add.rectangle(400, 300, 250, 60, 0x000000, 0.6);
    menuContainer.add(buttonBg);
    let startButton = this.add.text(400, 300, 'Iniciar Juego', { fontSize: '30px', fill: '#0f0' })
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => startButton.setStyle({ fill: '#ff0' }))
      .on('pointerout', () => startButton.setStyle({ fill: '#0f0' }))
      .on('pointerdown', () => {
          this.sound.play('clickSound');
          this.scene.start('StoryScene');
      });
    startButton.setOrigin(0.5);
    menuContainer.add(startButton);
    
    // Reproducir música de fondo
    let music = this.sound.add('bgMusic', { loop: true, volume: 0.5 });
    if (!music.isPlaying) {
      music.play();
    }
  }
}

// StoryScene: Presenta la narrativa ampliada en un contenedor con caja de texto.
class StoryScene extends Phaser.Scene {
  constructor() {
    super({ key: 'StoryScene' });
  }
  
  create() {
    console.log("StoryScene: Iniciando...");
    let storyContainer = this.add.container(0, 0);
    
    // Fondo con imagen de congreso y transparencia
    let bg = this.add.image(400, 300, 'congressBg').setDisplaySize(800,600);
    bg.setAlpha(0.85);
    storyContainer.add(bg);
    
    // Caja para la narrativa
    let textBox = this.add.rectangle(400, 230, 750, 180, 0x000000, 0.65);
    storyContainer.add(textBox);
    
    // Texto narrativo mejorado y más complejo
    const storyText = "El token Libra ha generado controversia y desconfianza. Milei, en medio del escándalo cripto, descubre que la comisión investigadora del Congreso está a punto de aprobarse. Decidido a frenar el proceso, planifica una estrategia audaz: un boicot radical o una intervención sutil que altere el debate. Cada decisión que tomes definirá el destino de su jugada y la estabilidad política del país. ¿Logrará Milei cambiar el curso de la historia o se verá envuelto en consecuencias aún mayores?";
    let narrative = this.add.text(60, 160, storyText, { fontSize: '20px', fill: '#fff', wordWrap: { width: 680 } });
    storyContainer.add(narrative);
    
    // Botón "Continuar"
    let buttonBg = this.add.rectangle(400, 500, 220, 60, 0x000000, 0.6);
    storyContainer.add(buttonBg);
    let continueButton = this.add.text(400, 500, 'Continuar', { fontSize: '28px', fill: '#0f0' })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
          this.sound.play('clickSound');
          this.scene.start('DecisionScene');
      });
    continueButton.setOrigin(0.5);
    storyContainer.add(continueButton);
  }
}

// DecisionScene: Escena para elegir la estrategia con estilos mejorados.
class DecisionScene extends Phaser.Scene {
  constructor() {
    super({ key: 'DecisionScene' });
  }
  
  create() {
    console.log("DecisionScene: Iniciando...");
    let decisionContainer = this.add.container(0, 0);
    
    // Fondo sólido para la escena de decisiones
    let bgRect = this.add.rectangle(400, 300, 800, 600, 0x222222, 1);
    decisionContainer.add(bgRect);
    
    let title = this.add.text(400, 80, 'Elige la estrategia de Milei:', { fontSize: '30px', fill: '#fff' });
    title.setOrigin(0.5);
    decisionContainer.add(title);
    
    // Opción 1: Boicot Radical
    let option1Bg = this.add.rectangle(400, 180, 350, 60, 0x000000, 0.6);
    decisionContainer.add(option1Bg);
    let option1 = this.add.text(400, 180, '1. Boicot Radical', { fontSize: '28px', fill: '#0f0' })
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => option1.setStyle({ fill: '#ff0' }))
      .on('pointerout', () => option1.setStyle({ fill: '#0f0' }))
      .on('pointerdown', () => {
          this.sound.play('clickSound');
          this.registry.set('strategy', 'boicot');
          this.scene.start('MiniGameScene');
      });
    option1.setOrigin(0.5);
    decisionContainer.add(option1);
    
    // Opción 2: Intervención Sutil
    let option2Bg = this.add.rectangle(400, 260, 350, 60, 0x000000, 0.6);
    decisionContainer.add(option2Bg);
    let option2 = this.add.text(400, 260, '2. Intervención Sutil', { fontSize: '28px', fill: '#0f0' })
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => option2.setStyle({ fill: '#ff0' }))
      .on('pointerout', () => option2.setStyle({ fill: '#0f0' }))
      .on('pointerdown', () => {
          this.sound.play('clickSound');
          this.registry.set('strategy', 'sutil');
          this.scene.start('MiniGameScene');
      });
    option2.setOrigin(0.5);
    decisionContainer.add(option2);
  }
}

// MiniGameScene: Mini juego con íconos reducidos y contenedores para instrucciones y puntaje.
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
    
    // Contenedor para instrucciones y puntaje
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
    
    // Contenedor para los íconos (se reducirán a un 50-60% de tamaño)
    this.iconsContainer = this.add.container(0, 0);
    
    // Temporizador: 12 segundos para aumentar la complejidad
    this.time.delayedCall(12000, () => {
      this.scene.start('EndScene', { score: this.score, strategy: strategy });
    });
    
    // Generar íconos cada 700 ms
    this.time.addEvent({
      delay: 700,
      callback: () => { this.spawnIcon(strategy); },
      loop: true
    });
  }
  
  spawnIcon(strategy) {
    let iconKey = (strategy === 'boicot') ? 'voteIcon' : 'debateIcon';
    let x = Phaser.Math.Between(50, 750);
    let y = Phaser.Math.Between(80, 550);
    let icon = this.add.sprite(x, y, iconKey).setInteractive();
    // Reducir tamaño de los íconos (0.6 de escala)
    icon.setScale(0.6);
    
    this.iconsContainer.add(icon);
    
    icon.on('pointerdown', () => {
      this.sound.play('clickSound', { volume: 0.7 });
      this.score++;
      this.scoreText.setText('Puntos: ' + this.score);
      icon.destroy();
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
    
    // Seleccionar fondo según resultado
    let bgKey = (this.finalScore >= 30) ? 'successBg' : 'failureBg';
    let bg = this.add.image(400, 300, bgKey).setDisplaySize(800,600);
    bg.setAlpha(0.9);
    endContainer.add(bg);
    
    // Caja para el mensaje final
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
    
    // Botón para reiniciar
    let buttonBg = this.add.rectangle(400, 500, 250, 60, 0x000000, 0.6);
    endContainer.add(buttonBg);
    let restartButton = this.add.text(400, 500, 'Reiniciar Juego', { fontSize: '28px', fill: '#0f0' })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
          this.sound.play('clickSound');
          this.scene.start('MenuScene');
      });
    restartButton.setOrigin(0.5);
    endContainer.add(restartButton);
    
    // Sonido final acorde al resultado
    if (this.finalScore >= 30) {
      this.sound.play('successSound');
    } else {
      this.sound.play('failureSound');
    }
  }
}

// Configuración de Phaser y arranque del juego.
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
