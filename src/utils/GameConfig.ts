export const GAME_W = 720
export const GAME_H = 1280

export const GameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_W,
  height: GAME_H,
  parent: 'game-container',
  backgroundColor: '#F7F7F7',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_W,
    height: GAME_H
  },
  physics: {
    default: 'matter',
    matter: {
      gravity: { y: 1.2 },
      enableSleep: true,
      debug: false
    }
  },
  audio: { disableWebAudio: false },
  scene: []
}

export const CONSTANTS = {
  SCORING: { NORMAL: 10, PERFECT: 50, PERFECT_TOLERANCE: 6 },
}
