// BootScene: carga todos los assets y muestra mensajes de depuración.
class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }
  
  preload() {
    console.log("BootScene: cargando assets...");
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
    console.log("BootScene: assets cargados, iniciando MenuScene...");
    this.scene.start('MenuScene');
  }
}

// MenuScene: Menú principal con contenedores para fondo, título y botón.
class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }
  
  create() {
    console.log("MenuScene: iniciando...");
    // Contenedor principal del menú
    let menuContainer = this.add.container(0, 0);

    // Fondo del menú con transparencia
    let bg = this.add.image(400, 300, 'menuBg').setDisplaySize(800,600);
    bg.setAlpha(0.9);
    menuContainer.add(bg);

    // Caja semitransparente para el título
    let titleBg = this.add.rectangle(400, 150, 500, 60, 0x000000, 0.5);
    menuContainer.add(titleBg);
    let title = this.add.text(400, 150, 'Boicot Cripto: El Escándalo de Milei', { fontSize: '32px', fill: '#fff' });
    title.setOrigin(0.5);
    menuContainer.add(title);

    // Contenedor para el botón "Iniciar Juego"
    let buttonBg = this.add.rectangle(400, 300, 200, 50, 0x000000, 0.5);
    menuContainer.add(buttonBg);
    let startButton = this.add.text(400, 300, 'Iniciar Juego', { fontSize: '28px', fill: '#0f0' })
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => startButton.setStyle({ fill: '#ff0' }))
      .on('pointerout', () => startButton.setStyle({ fill: '#0f0' }))
      .on('pointerdown', () => {
          this.sound.play('clickSound');
          this.scene.start('StoryScene');
      });
    startButton.setOrigin(0.5);
    menuContainer.add(startButton);
    
    // Música de fondo en bucle
    let music = this.sound.add('bgMusic', { loop: true, volume: 0.5 });
    if (!music.isPlaying) {
      music.play();
    }
  }
}

// StoryScene: Presenta la narrativa con contenedor para fondo y caja de texto.
class StoryScene extends Phaser.Scene {
  constructor() {
    super({ key: 'StoryScene' });
  }
  
  create() {
    console.log("StoryScene: iniciando...");
    let storyContainer = this.add.container(0, 0);
    
    // Fondo de la narrativa con transparencia
    let bg = this.add.image(400, 300, 'congressBg').setDisplaySize(800,600);
    bg.setAlpha(0.85);
    storyContainer.add(bg);
    
    // Caja para el texto narrativo
    let textBox = this.add.rectangle(400, 200, 700, 150, 0x000000, 0.6);
    storyContainer.add(textBox);
    
    const storyText = "Milei se ve envuelto en un escándalo cripto tras la polémica promoción del token Libra. Con la comisión investigadora a punto de votar en el Congreso, decide boicotear la votación para evitar la investigación. ¿Será su jugada maestra o desencadenará mayores complicaciones?";
    let narrative = this.add.text(100, 130, storyText, { fontSize: '20px', fill: '#fff', wordWrap: { width: 600 } });
    storyContainer.add(narrative);
    
    // Botón "Continuar"
    let buttonBg = this.add.rectangle(400, 520, 200, 50, 0x000000, 0.5);
    storyContainer.add(buttonBg);
    let continueButton = this.add.text(400, 520, 'Continuar', { fontSize: '26px', fill: '#0f0' })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
          this.sound.play('clickSound');
          this.scene.start('DecisionScene');
      });
    continueButton.setOrigin(0.5);
    storyContainer.add(continueButton);
  }
}

// DecisionScene: Pantalla para elegir la estrategia de Milei.
class DecisionScene extends Phaser.Scene {
  constructor() {
    super({ key: 'DecisionScene' });
  }
  
  create() {
    console.log("DecisionScene: iniciando...");
    let decisionContainer = this.add.container(0, 0);
    
    // Fondo sólido para la escena de decisiones
    let bgRect = this.add.rectangle(400, 300, 800, 600, 0x333333, 1);
    decisionContainer.add(bgRect);
    
    let title = this.add.text(400, 80, 'Elige la estrategia de Milei:', { fontSize: '28px', fill: '#fff' });
    title.setOrigin(0.5);
    decisionContainer.add(title);
    
    // Opción 1: Boicot Total
    let option1Bg = this.add.rectangle(400, 180, 300, 50, 0x000000, 0.5);
    decisionContainer.add(option1Bg);
    let option1 = this.add.text(400, 180, '1. Boicot Total', { fontSize: '26px', fill: '#0f0' })
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
    
    // Opción 2: Influencia Sutil
    let option2Bg = this.add.rectangle(400, 260, 300, 50, 0x000000, 0.5);
    decisionContainer.add(option2Bg);
    let option2 = this.add.text(400, 260, '2. Influencia Sutil', { fontSize: '26px', fill: '#0f0' })
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

// MiniGameScene: Mini juego interactivo con contenedores para instrucciones, puntaje e íconos.
class MiniGameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MiniGameScene' });
  }
  
  create() {
    console.log("MiniGameScene: iniciando...");
    const strategy = this.registry.get('strategy');
    let instruction = (strategy === 'boicot') ? 
      '¡Haz clic en los íconos de voto para bloquear la votación!' : 
      '¡Haz clic en los íconos correctos para influir en el debate y evita distracciones!';
    
    // Contenedor para instrucciones y puntaje
    let miniGameContainer = this.add.container(0, 0);
    let instructionBg = this.add.rectangle(400, 30, 750, 40, 0x000000, 0.5);
    miniGameContainer.add(instructionBg);
    let instructionText = this.add.text(400, 30, instruction, { fontSize: '22px', fill: '#fff' });
    instructionText.setOrigin(0.5);
    miniGameContainer.add(instructionText);
    
    // Puntaje
    this.score = 0;
    this.scoreText = this.add.text(20, 20, 'Puntos: 0', { fontSize: '24px', fill: '#fff' });
    miniGameContainer.add(this.scoreText);
    
    // Contenedor para los íconos que se generarán
    this.iconsContainer = this.add.container(0, 0);
    
    // Temporizador de 10 segundos para finalizar el mini juego
    this.time.delayedCall(10000, () => {
      this.scene.start('EndScene', { score: this.score, strategy: strategy });
    });
    
    // Evento para crear íconos cada 800 ms
    this.time.addEvent({
      delay: 800,
      callback: () => { this.spawnIcon(strategy); },
      loop: true
    });
  }
  
  spawnIcon(strategy) {
    let iconKey = (strategy === 'boicot') ? 'voteIcon' : 'debateIcon';
    let x = Phaser.Math.Between(50, 750);
    let y = Phaser.Math.Between(80, 550);
    let icon = this.add.sprite(x, y, iconKey).setInteractive();
    
    // Agregar el ícono al contenedor de íconos
    this.iconsContainer.add(icon);
    
    icon.on('pointerdown', () => {
      this.sound.play('clickSound', { volume: 0.7 });
      this.score++;
      this.scoreText.setText('Puntos: ' + this.score);
      icon.destroy();
    });
    
    // Animación de rotación para el ícono
    this.tweens.add({
      targets: icon,
      angle: 360,
      duration: 1500,
      ease: 'Linear'
    });
    
    // Eliminar el ícono después de 1.5 segundos si no se ha clickeado
    this.time.delayedCall(1500, () => {
      if (icon && icon.active) { icon.destroy(); }
    });
  }
}

// EndScene: Escena final con contenedores para fondo, mensaje y botón de reinicio.
class EndScene extends Phaser.Scene {
  constructor() {
    super({ key: 'EndScene' });
  }
  
  init(data) {
    this.finalScore = data.score;
    this.strategy = data.strategy;
  }
  
  create() {
    console.log("EndScene: iniciando...");
    let endContainer = this.add.container(0, 0);
    
    // Selección de fondo según el resultado
    let bgKey = (this.finalScore >= 20) ? 'successBg' : 'failureBg';
    let bg = this.add.image(400, 300, bgKey).setDisplaySize(800,600);
    bg.setAlpha(0.9);
    endContainer.add(bg);
    
    // Caja para el mensaje final
    let resultBg = this.add.rectangle(400, 280, 750, 100, 0x000000, 0.6);
    endContainer.add(resultBg);
    
    let resultText = '';
    if (this.strategy === 'boicot') {
      resultText = (this.finalScore >= 20) ? 
        '¡Éxito total! El boicot de Milei detuvo la votación, generando euforia entre sus seguidores.' : 
        'El boicot falló. La votación siguió y las críticas se intensificaron.';
    } else {
      resultText = (this.finalScore >= 20) ? 
        'La influencia sutil alteró el debate. Aunque el resultado fue ambiguo, Milei se consolidó como estratega.' : 
        'La estrategia de influencia fracasó y el debate se volvió caótico.';
    }
    
    let result = this.add.text(400, 280, resultText, { fontSize: '24px', fill: '#fff', wordWrap: { width: 700 } });
    result.setOrigin(0.5);
    endContainer.add(result);
    
    // Botón para reiniciar el juego
    let buttonBg = this.add.rectangle(400, 500, 200, 50, 0x000000, 0.5);
    endContainer.add(buttonBg);
    let restartButton = this.add.text(400, 500, 'Reiniciar Juego', { fontSize: '26px', fill: '#0f0' })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
          this.sound.play('clickSound');
          this.scene.start('MenuScene');
      });
    restartButton.setOrigin(0.5);
    endContainer.add(restartButton);
    
    // Reproducir sonido acorde al resultado
    if (this.finalScore >= 20) {
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
