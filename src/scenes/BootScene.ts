import Phaser from 'phaser'
import { AudioManager } from '@/managers/AudioManager'

export class BootScene extends Phaser.Scene {
  constructor() { super({ key: 'BootScene' }) }

  preload(): void {
    // Hook progress bar in index.html
    const fill = document.getElementById('fill') as HTMLDivElement | null
    this.load.on('progress', (p: number) => { if (fill) fill.style.width = `${Math.round(p*100)}%` })
    this.load.on('complete', () => {
      const loading = document.getElementById('loading')
      const container = document.getElementById('game-container')
      if (loading && container) { loading.style.display = 'none'; container.style.display = 'block' }
    })

    // Audio files (adjust to your actual filenames under /public/assets/sounds)
    AudioManager.I().init(this)
    AudioManager.I().preload([
      { key: 'button_click', path: 'assets/sounds/button_click.wav' },
      { key: 'block_drop', path: 'assets/sounds/block_drop.wav' },
      { key: 'stack_success', path: 'assets/sounds/stack_success.wav' },
      { key: 'obstacle_hit', path: 'assets/sounds/obstacle_hit.wav' },
      { key: 'game_over', path: 'assets/sounds/game_over.wav' }
    ])

    // Sprites (adjust names to match your exported files)
    this.load.image('bg', 'assets/sprites/backgrounds/game_background_720x1280.png')
    this.load.image('block_red', 'assets/sprites/blocks/block_red_60x30.png')
    this.load.image('block_blue', 'assets/sprites/blocks/block_blue_60x30.png')
    this.load.image('block_green', 'assets/sprites/blocks/block_green_60x30.png')
    this.load.image('bomb', 'assets/sprites/obstacles/bomb_40x40.png')
    this.load.image('spike', 'assets/sprites/obstacles/spike_50x20.png')
    this.load.image('play_btn', 'assets/sprites/ui/play_button_80x80.png')
    this.load.image('pause_btn', 'assets/sprites/ui/pause_button_60x60.png')
    this.load.image('score_bg', 'assets/sprites/ui/score_bg.png')
  }

  create(): void {
    this.scene.start('MenuScene')
  }
}
