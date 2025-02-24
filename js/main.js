const config = {
    type: Phaser.WEBGL,
    width: 1200,
    height: 800,
    parent: 'game-container',
    scene: [
        BootScene,
        MenuScene,
        DecisionScene,
        BoicotScene,
        SutilScene,
        EndScene
    ],
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 200 } }
    },
    audio: {
        disableWebAudio: false
    }
};

const game = new Phaser.Game(config);
const narrativeManager = new NarrativeManager();
const gameProgression = new GameProgression();
