import Phaser from 'phaser'
import { StorageManager } from '@/managers/StorageManager'
import { AudioManager } from '@/managers/AudioManager'

export class MenuScene extends Phaser.Scene {
  constructor() { super({ key: 'MenuScene' }) }

  create(): void {
    const { width, height } = this.scale
    this.add.image(width/2, height/2, 'bg').setDisplaySize(width, height)

    const title = this.add.text(width/2, 220, 'STACK & DODGE', {
      fontFamily: 'game', fontSize: '48px', color: '#2C3E50'
    }).setOrigin(0.5)

    const hi = StorageManager.getData().highScore
    this.add.image(width/2, 300, 'score_bg').setOrigin(0.5)
    this.add.text(width/2, 300, `HIGH: ${hi}`, { fontFamily: 'game', fontSize: '20px', color: '#FF6B6B' }).setOrigin(0.5)

    // Sounds
    AudioManager.I().create(['button_click', 'block_drop', 'stack_success', 'obstacle_hit', 'game_over'])

    // Play button
    const btn = this.add.image(width/2, height/2 + 80, 'play_btn').setInteractive({ useHandCursor: true })
    btn.on('pointerdown', () => {
      AudioManager.I().play('button_click')
      this.scene.start('GameScene')
    })

    // Sound toggle (simple text for now)
    const soundLabel = this.add.text(width/2, height/2 + 180, '🔊 SOUND: ON', { fontFamily: 'game', fontSize: '18px', color: '#2C3E50' }).setOrigin(0.5)
    soundLabel.setInteractive({ useHandCursor: true })
    soundLabel.on('pointerdown', () => {
      const enabled = AudioManager.I().toggle()
      soundLabel.setText(enabled ? '🔊 SOUND: ON' : '🔇 SOUND: OFF')
    })
  }
}
