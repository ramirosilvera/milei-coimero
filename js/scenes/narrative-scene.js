import { narrativeTree, FactionSystem } from '../narrative-manager.js';

export default class NarrativeScene extends Phaser.Scene {
  constructor() {
    super({ key: 'NarrativeScene' });
  }
  
  init(data) {
    this.currentNodeId = data.currentNode || "start";
    this.factionSystem = data.factionSystem || new FactionSystem();
  }
  
  create() {
    const camWidth = this.cameras.main.width;
    const camHeight = this.cameras.main.height;
    
    const bg = this.add.image(camWidth / 2, camHeight / 2, 'congress_bg');
    bg.setDisplaySize(camWidth, camHeight);
    bg.setAlpha(0.8);
    this.add.rectangle(camWidth / 2, camHeight / 2, camWidth, camHeight, 0x000000, 0.5);
    this.renderNode();
  }
  
  renderNode() {
    const node = narrativeTree[this.currentNodeId];
    
    if (this.narrativeText) this.narrativeText.destroy();
    if (this.choiceButtons) {
      this.choiceButtons.forEach(btn => btn.destroy());
    }
    
    const camWidth = this.cameras.main.width;
    this.narrativeText = this.add.text(camWidth / 2, 300, node.text, {
      fontSize: '28px',
      fill: '#fff',
      align: 'center',
      wordWrap: { width: camWidth - 100 }
    }).setOrigin(0.5).setShadow(2, 2, "#000", 2, true, true);
    
    this.choiceButtons = [];
    if (node.choices.length > 0) {
      node.choices.forEach((choice, index) => {
        const btn = this.add.text(this.cameras.main.centerX, 450 + index * 60, choice.text, {
          fontSize: '26px',
          fill: '#0f0'
        })
          .setInteractive({ useHandCursor: true })
          .setOrigin(0.5)
          .setStyle({ padding: '10px 20px', backgroundColor: '#222' });
        btn.on('pointerover', () => btn.setStyle({ fill: '#ff0' }));
        btn.on('pointerout', () => btn.setStyle({ fill: '#0f0' }));
        btn.on('pointerdown', () => {
          this.sound.play('click');
          if (choice.effect) this.factionSystem.update(choice.effect);
          if (choice.miniGame) {
            this.registry.set('nextNode', choice.next);
            this.registry.set('currentFaction', this.factionSystem);
            this.registry.set('gameType', choice.miniGame);
            this.scene.start('MiniGameScene', { gameType: choice.miniGame });
          } else {
            this.currentNodeId = choice.next;
            this.renderNode();
          }
        });
        this.choiceButtons.push(btn);
      });
    } else {
      this.time.delayedCall(2000, () => {
        this.scene.start('EndScene', { factionSystem: this.factionSystem, finalText: node.text });
      });
    }
  }
}
