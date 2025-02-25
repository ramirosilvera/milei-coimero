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
    this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'congress_bg')
      .setDisplaySize(this.cameras.main.width, this.cameras.main.height)
      .setAlpha(0.8);
    // Overlay para legibilidad
    this.add.rectangle(this.cameras.main.centerX, this.cameras.main.centerY, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.5);
    this.renderNode();
  }
  
  renderNode() {
    const node = narrativeTree[this.currentNodeId];
    
    if (this.narrativeText) this.narrativeText.destroy();
    if (this.choiceButtons) {
      this.choiceButtons.forEach(btn => btn.destroy());
    }
    
    this.narrativeText = this.add.text(this.cameras.main.centerX, 300, node.text, {
      fontSize: '28px',
      fill: '#fff',
      align: 'center',
      wordWrap: { width: this.cameras.main.width - 100 }
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
        btn.on('pointerover', () => {
          btn.setStyle({ fill: '#ff0' });
          console.log("Opción seleccionada: ", choice.text);
        });
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
