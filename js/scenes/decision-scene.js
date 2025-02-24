export default class DecisionScene extends Phaser.Scene {
  constructor() {
    super({ key: 'DecisionScene' });
  }
  
  create() {
    // Fondo de la escena
    this.add.image(600, 400, 'congress_bg');
    this.add.text(600, 50, 'Selecciona tu Estrategia', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
    
    // Botones para cada estrategia
    const boicotButton = this.add.image(400, 300, 'boicot_icon').setInteractive({ useHandCursor: true });
    const influenciaButton = this.add.image(600, 300, 'vote_icon').setInteractive({ useHandCursor: true });
    const campañaButton = this.add.image(800, 300, 'debate_icon').setInteractive({ useHandCursor: true });
    
    // Etiquetas para cada botón
    this.add.text(400, 380, 'Boicot Radical', { fontSize: '20px', fill: '#fff' }).setOrigin(0.5);
    this.add.text(600, 380, 'Influencia Sutil', { fontSize: '20px', fill: '#fff' }).setOrigin(0.5);
    this.add.text(800, 380, 'Campaña Medial', { fontSize: '20px', fill: '#fff' }).setOrigin(0.5);
    
    // Tooltips informativos
    boicotButton.on('pointerover', () => {
      this.showTooltip("Ataca al Establecimiento y debilita la comisión investigadora.");
    });
    influenciaButton.on('pointerover', () => {
      this.showTooltip("Manipula la opinión de los medios y fortalece tus aliados.");
    });
    campañaButton.on('pointerover', () => {
      this.showTooltip("Gana apoyo popular a través de una campaña mediática vibrante.");
    });
    
    boicotButton.on('pointerout', () => {
      this.hideTooltip();
    });
    influenciaButton.on('pointerout', () => {
      this.hideTooltip();
    });
    campañaButton.on('pointerout', () => {
      this.hideTooltip();
    });
    
    // Asignación de estrategia y navegación según selección
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
    
    // Elemento para mostrar tooltips
    this.tooltip = this.add.text(600, 700, '', { fontSize: '20px', fill: '#ffdd00', align: 'center', wordWrap: { width: 800 } });
    this.tooltip.setOrigin(0.5);
    this.tooltip.setDepth(10);
  }
  
  showTooltip(message) {
    this.tooltip.setText(message);
  }
  
  hideTooltip() {
    this.tooltip.setText('');
  }
}

