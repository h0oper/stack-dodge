import './style.css'
import Phaser from 'phaser'
import { GameConfig } from '@/utils/GameConfig'
import { BootScene } from '@/scenes/BootScene'
import { MenuScene } from '@/scenes/MenuScene'
import { GameScene } from '@/scenes/GameScene'
import { GameOverScene } from '@/scenes/GameOverScene'

GameConfig.scene = [BootScene, MenuScene, GameScene, GameOverScene]

const game = new Phaser.Game(GameConfig)

// Global error handler
window.addEventListener('error', (e) => console.error('Global error:', e.error))

export default game
