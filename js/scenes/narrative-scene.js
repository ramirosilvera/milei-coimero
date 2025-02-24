import { narrativeTree, FactionSystem } from '../narrative-manager.js';

export default class NarrativeScene extends Phaser.Scene {
  constructor() {
    super({ key: 'NarrativeScene' });
  }
  
  init(data) {
    // currentNode indica el id del nodo narrativo actual
    this.currentNodeId = data.currentNode || "start";
    // Creamos o recuperamos el sistema de facciones (se podría persistir en registry)
    this.factionSystem = data.factionSystem || new FactionSystem();
  }
  
  create() {
    this.add.image(600, 400, 'congress_bg').setAlpha(0.8);
    
    // Fondo semitransparente para el texto
    this.add.rectangle(600, 400, 1100, 300, 0x000000, 0.6);
    
    this.renderNode();
  }
  
  renderNode() {
    const node = narrativeTree[this.currentNodeId];
    
    // Limpiar textos anteriores (si existieran)
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
          // Aplicar efectos de facciones
          if (choice.effect) this.factionSystem.update(choice.effect);
          // Si la opción requiere mini-juego, guardamos el siguiente nodo y lanzamos el mini-juego
          if (choice.miniGame) {
            this.registry.set('nextNode', choice.next);
            this.registry.set('currentFaction', this.factionSystem);
            this.registry.set('gameType', choice.miniGame);
            this.scene.start('MiniGameScene', { gameType: choice.miniGame });
          } else {
            // Si no hay mini-juego, simplemente avanzamos a la siguiente narrativa
            this.currentNodeId = choice.next;
            this.renderNode();
          }
        });
        this.choiceButtons.push(btn);
      });
    } else {
      // Nodo terminal, pasar a escena final
      this.time.delayedCall(2000, () => {
        this.scene.start('EndScene', { factionSystem: this.factionSystem, finalText: node.text });
      });
    }
  }
}
