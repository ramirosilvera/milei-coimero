import BootScene from './scenes/boot-scene.js';
import TutorialScene from './scenes/tutorial-scene.js';
import MenuScene from './scenes/menu-scene.js';
import NarrativeScene from './scenes/narrative-scene.js';
import MiniGameScene from './scenes/mini-game-scene.js';
import EndScene from './scenes/end-scene.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: window.innerWidth,
  height: window.innerHeight,
  scene: [BootScene, TutorialScene, MenuScene, NarrativeScene, MiniGameScene, EndScene],
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 0 }, debug: false }
  },
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};

if (!window.game) {
  window.game = new Phaser.Game(config);
} else {
  console.log("La variable 'game' ya ha sido declarada.");
}
