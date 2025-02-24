import BootScene from './scenes/boot-scene.js';
import TutorialScene from './scenes/tutorial-scene.js';
import MenuScene from './scenes/menu-scene.js';
import NarrativeScene from './scenes/narrative-scene.js';
import MiniGameScene from './scenes/mini-game-scene.js';
import EndScene from './scenes/end-scene.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 1200,
  height: 800,
  scene: [BootScene, TutorialScene, MenuScene, NarrativeScene, MiniGameScene, EndScene],
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 0 }, debug: false }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};

const game = new Phaser.Game(config);

