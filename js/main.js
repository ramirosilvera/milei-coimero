const config = {
    type: Phaser.WEBGL,
    width: 1200,
    height: 800,
    parent: 'game-container',
    scene: [
        BootScene,
        MenuScene,
        DecisionScene,
        BoicotMiniGame,
        SutilMiniGame,
        MediaMiniGame,
        EndScene
    ],
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 } }
    },
    audio: {
        disableWebAudio: false
    }
};

let game = new Phaser.Game(config);
let narrativeManager = new NarrativeManager();
let gameProgression = new GameProgression();
