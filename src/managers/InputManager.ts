export class InputManager {
  constructor(private scene: Phaser.Scene) {
    this.setup()
  }

  private setup() {
    // Tap / Click
    this.scene.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
      this.scene.events.emit('input:tap', { x: p.worldX, y: p.worldY })
    })
    // Space key for desktop
    this.scene.input.keyboard?.on('keydown-SPACE', () => {
      this.scene.events.emit('input:tap', {})
    })
    // Prevent long-press menu
    this.scene.game.canvas.addEventListener('contextmenu', (e) => e.preventDefault())
  }

  destroy() {
    this.scene.input.removeAllListeners()
  }
}
