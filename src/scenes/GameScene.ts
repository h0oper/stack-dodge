import Phaser from 'phaser'

export class GameScene extends Phaser.Scene {
  private currentBlock: Phaser.Physics.Matter.Image | null = null
  private moveTween: Phaser.Tweens.Tween | null = null
  private score = 0
  private scoreText!: Phaser.GameObjects.Text
  private hasDropped = false   // <-- NEW: guards multiple drop presses

  constructor() {
    super({ key: 'GameScene' })
  }

  create(): void {
    const { width, height } = this.scale

    // Background + ground
    this.add.image(width / 2, height / 2, 'bg').setDisplaySize(width, height)
    this.matter.add.rectangle(width / 2, height - 40, width * 0.9, 40, { isStatic: true })

    // Score
    this.score = 0
    this.scoreText = this.add.text(20, 20, 'Score: 0', {
      fontSize: '24px',
      color: '#2C3E50'
    })

    // DIRECT INPUT (mouse/touch + SPACE)
    this.input.on('pointerdown', this.dropCurrentBlock, this)
    this.input.keyboard?.on('keydown-SPACE', this.dropCurrentBlock, this)

    // First block
    this.spawnBlock()

    // Count a landing when body sleeps
    this.matter.world.on('sleepstart', (event: any) => {
      if (this.currentBlock && event.body === this.currentBlock.body) {
        this.handleBlockLanded()
      }
    })

    // Cleanup on scene shutdown
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input.off('pointerdown', this.dropCurrentBlock, this)
      this.input.keyboard?.off('keydown-SPACE', this.dropCurrentBlock, this)
      if (this.moveTween) this.moveTween.stop()
      this.moveTween = null
      this.currentBlock = null
    })
  }

  private spawnBlock(): void {
    this.hasDropped = false   // <-- reset guard for the new block

    const { width } = this.scale
    const yTop = 180
    const keys = ['block_red', 'block_blue', 'block_green']
    const key = keys[Math.floor(Math.random() * keys.length)]

    this.currentBlock = this.matter.add.image(width * 0.2, yTop, key)
    this.currentBlock.setStatic(true)         // hold in place
    this.currentBlock.setIgnoreGravity(true)  // no gravity until drop
    this.currentBlock.setFixedRotation()
    this.currentBlock.setFrictionAir(0)

    this.moveTween = this.tweens.add({
      targets: this.currentBlock,
      x: width * 0.8,
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut'
    })
  }

  private dropCurrentBlock(): void {
    // Ignore if nothing to drop or we've already dropped this one
    if (!this.currentBlock || this.hasDropped) return
    this.hasDropped = true

    // Stop horizontal tween before enabling gravity
    if (this.moveTween) {
      this.moveTween.stop()
      this.moveTween = null
    }

    this.currentBlock.setStatic(false)
    this.currentBlock.setIgnoreGravity(false)
    this.currentBlock.setVelocity(0, 0)       // drop straight
    this.currentBlock.setAngularVelocity(0)
  }

  private handleBlockLanded(): void {
    this.score += 10
    this.scoreText.setText(`Score: ${this.score}`)

    this.currentBlock = null
    this.spawnBlock()
  }
}
