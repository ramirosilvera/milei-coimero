const scenes = {
  BootScene: class BootScene extends Phaser.Scene {
    preload() {
      // Carga de nuevos assets
      this.load.setPath('assets/');
      this.load.image('congress', 'scenes/congress.jpg');
      this.load.spritesheet('milei', 'characters/milei.png', { frameWidth: 256, frameHeight: 256 });
      this.load.audio('qte_success', 'sounds/qte_success.wav');
    }

    create() {
      this.scene.start('MenuScene');
    }
  },

  MenuScene: class MenuScene extends Phaser.Scene {
    create() {
      // Menú principal mejorado
      this.add.dynamicBitmapText(400, 150, 'title_font', 'Cripto Revolución', 48)
        .setOrigin(0.5)
        .setTint(0xffd700);
      
      this.createAnimatedButton(400, 300, 'Nueva Partida', 'StoryScene');
      this.createAnimatedButton(400, 380, 'Cargar Partida', 'LoadScene');
    }

    createAnimatedButton(x, y, text, targetScene) {
      const btn = this.add.container(x, y)
        .setInteractive(new Phaser.Geom.Rectangle(-100, -20, 200, 40), Phaser.Geom.Rectangle.Contains)
        .on('pointerover', () => btn.y -= 5)
        .on('pointerout', () => btn.y += 5)
        .on('pointerdown', () => this.scene.start(targetScene));
      
      btn.add(this.add.rectangle(0, 0, 200, 40, 0x8b4513));
      btn.add(this.add.text(0, 0, text, { fontFamily: 'Roboto Condensed', fontSize: '24px' })
        .setOrigin(0.5));
    }
  },

  DecisionScene: class DecisionScene extends Phaser.Scene {
    create() {
      const narrativeManager = new NarrativeManager();
      
      this.createDecisionButton('Boicot Radical', () => {
        narrativeManager.applyDecision('boicot');
        this.launchQTEScene();
      });
      
      this.createDecisionButton('Intervención Sutil', () => {
        narrativeManager.applyDecision('sutil');
        this.launchDebateMiniGame();
      });
    }

    createDecisionButton(text, callback) {
      // Sistema de botones animados
      const btn = this.add.container(400, 300)
        .setInteractive()
        .on('pointerdown', callback);
      
      this.tweens.add({
        targets: btn,
        scale: 0.95,
        duration: 100,
        yoyo: true
      });
    }
  },

  QTEScene: class QTEScene extends Phaser.Scene {
    create() {
      this.setupQTE();
      this.setupTimers();
    }

    setupQTE() {
      // Sistema de Eventos Rápidos
      this.qteSequence = [
        { key: 'A', time: 1000 },
        { key: 'S', time: 800 },
        { key: 'D', time: 600 }
      ];
      
      this.displayQTEPrompt();
    }

    displayQTEPrompt() {
      // Lógica para mostrar prompts de QTE
    }
  }
};

// Configuración final del juego
const config = {
  type: Phaser.WEBGL,
  width: 1200,
  height: 800,
  parent: 'game-container',
  scene: Object.values(scenes),
  physics: { default: 'arcade' },
  audio: { disableWebAudio: false }
};

new Phaser.Game(config);
