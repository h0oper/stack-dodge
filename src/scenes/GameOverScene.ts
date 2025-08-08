import Phaser from 'phaser'
import { StorageManager } from '@/managers/StorageManager'

export class GameOverScene extends Phaser.Scene {
  private finalScore = 0
  constructor() { super({ key: 'GameOverScene' }) }

  init(data: { score?: number }) {
    this.finalScore = data?.score ?? 0
  }

  create(): void {
    const { width, height } = this.scale
    this.add.rectangle(width/2, height/2, width, height, 0x000000, 0.15)
    const hi = StorageManager.getData().highScore

    this.add.text(width/2, height/2 - 20, 'GAME OVER', { fontSize: '36px', color: '#2C3E50' }).setOrigin(0.5)
    this.add.text(width/2, height/2 + 20, `Score: ${this.finalScore}  |  High: ${hi}`, { fontSize: '18px', color: '#2C3E50' }).setOrigin(0.5)
    this.add.text(width/2, height/2 + 80, 'Tap to Restart', { fontSize: '16px', color: '#2C3E50' }).setOrigin(0.5)

    this.input.once('pointerdown', () => this.scene.start('GameScene'))
  }
}
