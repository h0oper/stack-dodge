import Phaser from 'phaser'

export class GameScene extends Phaser.Scene {
  constructor() { super({ key: 'GameScene' }) }

  create(): void {
    const { width, height } = this.scale
    this.add.image(width/2, height/2, 'bg').setDisplaySize(width, height)

    // Placeholder ground & instruction
    this.matter.add.rectangle(width/2, height-40, width*0.9, 40, { isStatic: true })
    this.add.text(width/2, 120, 'M0: Gameplay coming next', { fontSize: '20px', color: '#2C3E50' }).setOrigin(0.5)

    // Back to menu (for now)
    this.input.keyboard?.on('keydown-ESC', () => this.scene.start('MenuScene'))
  }
}
