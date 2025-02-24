export default class DecisionScene extends Phaser.Scene {
  constructor() {
    super({ key: 'DecisionScene' });
  }
  
  create() {
    this.add.image(600, 400, 'congress_bg');
    this.add.text(600, 50, 'Selecciona tu Estrategia', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
    
    // Botones de estrategias
    const boicotButton = this.add.image(400, 300, 'boicot_icon')
      .setInteractive({ useHandCursor: true });
    const influenciaButton = this.add.image(600, 300, 'vote_icon')
      .setInteractive({ useHandCursor: true });
    const campañaButton = this.add.image(800, 300, 'debate_icon')
      .setInteractive({ useHandCursor: true });
    
    // Etiquetas
    this.add.text(400, 380, 'Boicot Radical', { fontSize: '20px', fill: '#fff' }).setOrigin(0.5);
    this.add.text(600, 380, 'Influencia Sutil', { fontSize: '20px', fill: '#fff' }).setOrigin(0.5);
    this.add.text(800, 380, 'Campaña Medial', { fontSize: '20px', fill: '#fff' }).setOrigin(0.5);
    
    // Tooltip informativo
    this.tooltip = this.add.text(600, 700, '', { fontSize: '20px', fill: '#ffdd00', align: 'center', wordWrap: { width: 800 } })
      .setOrigin(0.5)
      .setDepth(10);
    
    boicotButton.on('pointerover', () => this.showTooltip("Ataca al Establecimiento y debilita la comisión investigadora."));
    influenciaButton.on('pointerover', () => this.showTooltip("Manipula los medios y fortalece tus aliados."));
    campañaButton.on('pointerover', () => this.showTooltip("Gana apoyo popular con una campaña vibrante."));
    boicotButton.on('pointerout', () => this.hideTooltip());
    influenciaButton.on('pointerout', () => this.hideTooltip());
    campañaButton.on('pointerout', () => this.hideTooltip());
    
    boicotButton.on('pointerdown', () => {
      this.sound.play('boicot');
      this.registry.set('strategy', 'boicot');
      this.scene.start('BoicotScene');
    });
    
    influenciaButton.on('pointerdown', () => {
      this.sound.play('click');
      this.registry.set('strategy', 'influencia');
      this.scene.start('SutilScene');
    });
    
    campañaButton.on('pointerdown', () => {
      this.sound.play('click');
      this.registry.set('strategy', 'campaña');
      this.scene.start('SutilScene');
    });
  }
  
  showTooltip(message) {
    this.tooltip.setText(message);
  }
  
  hideTooltip() {
    this.tooltip.setText('');
  }
}
