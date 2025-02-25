import { narrativeTree, FactionSystem } from '../narrative-manager.js';

export default class NarrativeScene extends Phaser.Scene {
  constructor() {
    super({ key: 'NarrativeScene' });
  }
  
  init(data) {
    // Nodo narrativo actual
    this.currentNodeId = data.currentNode || "start";
    // Sistema de facciones (persistido o nuevo)
    this.factionSystem = data.factionSystem || new FactionSystem();
  }
  
  create() {
    this.add.image(600, 400, 'congress_bg').setAlpha(0.8);
    // Overlay para mejorar legibilidad
    this.add.rectangle(600, 400, 1100, 300, 0x000000, 0.6);
    this.renderNode();
  }
  
  renderNode() {
    const node = narrativeTree[this.currentNodeId];
    
    if (this.narrativeText) this.narrativeText.destroy();
    if (this.choiceButtons) {
      this.choiceButtons.forEach(btn => btn.destroy());
    }
    
    this.narrativeText = this.add.text(600, 300, node.text, {
      fontSize: '26px',
      fill: '#fff',
      align: 'center',
      wordWrap: { width: 1000 }
    }).setOrigin(0.5);
    this.narrativeText.setShadow(2, 2, "#000", 2, true, true);
    
    this.choiceButtons = [];
    if (node.choices.length > 0) {
      node.choices.forEach((choice, index) => {
        const btn = this.add.text(600, 450 + index * 50, choice.text, {
          fontSize: '24px',
          fill: '#0f0'
        })
          .setInteractive({ useHandCursor: true })
          .setOrigin(0.5);
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
