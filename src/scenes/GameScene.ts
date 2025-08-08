import Phaser from 'phaser'
import { Stack } from '@/objects/Stack'
import { CONSTANTS } from '@/utils/GameConfig'

export class GameScene extends Phaser.Scene {
  private currentBlock: Phaser.Physics.Matter.Image | null = null
  private moveTween: Phaser.Tweens.Tween | null = null
  private score = 0
  private scoreText!: Phaser.GameObjects.Text
  private scorePanel!: Phaser.GameObjects.Rectangle
  private hasDropped = false

  private stack = new Stack()
  private ground!: MatterJS.BodyType
  private followDot!: Phaser.GameObjects.Rectangle
  private validSurfaces = new Set<MatterJS.BodyType>() // ground + landed blocks

  constructor() {
    super({ key: 'GameScene' })
  }

  create(): void {
    const { width, height } = this.scale

    // Background (pin to camera so it doesn't scroll weirdly)
    const bg = this.add.image(width / 2, height / 2, 'bg').setDisplaySize(width, height)
    bg.setScrollFactor(0)

    // Ground
    this.ground = this.matter.add.rectangle(width / 2, height - 40, width * 0.9, 40, { isStatic: true })
    this.validSurfaces.add(this.ground)

    // Camera follow marker + bounds (allow camera to move up safely)
    this.followDot = this.add.rectangle(width / 2, height / 2, 2, 2, 0x000000, 0)
    this.cameras.main.startFollow(this.followDot, true, 0.12, 0.12, 0, -250)
    this.cameras.main.setBounds(0, -3000, width, height + 3000)

    // ----- UI (pinned to camera) -----
    this.scorePanel = this.add.rectangle(100, 36, 160, 40, 0xffffff, 0.85)
      .setStrokeStyle(2, 0x2c3e50, 0.25)
      .setScrollFactor(0)
    this.scoreText = this.add.text(20, 20, 'Score: 0', {
      fontSize: '24px',
      color: '#2C3E50'
    }).setScrollFactor(0)
    this.children.bringToTop(this.scoreText)

    // Input
    this.input.on('pointerdown', this.dropCurrentBlock, this)
    this.input.keyboard?.on('keydown-SPACE', this.dropCurrentBlock, this)

    // First block
    this.spawnBlock()

    // LANDING: first valid collision ends the drop
    this.matter.world.on('collisionstart', (evt: Phaser.Types.Physics.Matter.MatterCollisionEvent) => {
      if (!this.currentBlock || !this.hasDropped) return
      const cb = this.currentBlock.body as MatterJS.BodyType

      for (const pair of evt.pairs) {
        const { bodyA, bodyB } = pair
        if (bodyA === cb || bodyB === cb) {
          const other = bodyA === cb ? bodyB : bodyA
          if (this.validSurfaces.has(other)) {
            this.handleBlockLanded(other)
            break
          }
        }
      }
    })

    // Cleanup
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input.off('pointerdown', this.dropCurrentBlock, this)
      this.input.keyboard?.off('keydown-SPACE', this.dropCurrentBlock, this)
      if (this.moveTween) this.moveTween.stop()
      this.moveTween = null
      this.currentBlock = null
    })
  }

  private spawnBlock(): void {
    this.hasDropped = false
    const { width } = this.scale

    // Spawn a bit above current top
    const topY = this.stack.topY()
    const yTop = Number.isFinite(topY) ? Math.max(120, topY - 160) : 180

    const keys = ['block_red', 'block_blue', 'block_green']
    const key = keys[Math.floor(Math.random() * keys.length)]

    this.currentBlock = this.matter.add.image(width * 0.2, yTop, key)
    this.currentBlock.setStatic(true)         // aim phase
    this.currentBlock.setIgnoreGravity(true)
    this.currentBlock.setFixedRotation()
    this.currentBlock.setFrictionAir(0)

    // Left↔right tween
    this.moveTween = this.tweens.add({
      targets: this.currentBlock,
      x: width * 0.8,
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut'
    })

    this.updateCameraTarget()
  }

  private dropCurrentBlock(): void {
    if (!this.currentBlock || this.hasDropped) return
    this.hasDropped = true

    if (this.moveTween) { this.moveTween.stop(); this.moveTween = null }
    this.currentBlock.setStatic(false)
    this.currentBlock.setIgnoreGravity(false)
    this.currentBlock.setVelocity(0, 0)
    this.currentBlock.setAngularVelocity(0)
  }

  private handleBlockLanded(otherBody: MatterJS.BodyType): void {
    if (!this.currentBlock) return

    // Freeze landed block for tower stability
    this.currentBlock.setVelocity(0, 0)
    this.currentBlock.setAngularVelocity(0)
    this.currentBlock.setStatic(true)
    this.currentBlock.setIgnoreGravity(true)

    // Base score
    let gained = CONSTANTS.SCORING.NORMAL

    // Perfect‑center bonus if landing on the previous block
    const last = this.stack.last()
    if (last && otherBody === last.body) {
      const dx = Math.abs(this.currentBlock.x - last.x)
      if (dx <= CONSTANTS.SCORING.PERFECT_TOLERANCE) {
        gained += CONSTANTS.SCORING.PERFECT
        this.cameras.main.flash(100, 255, 230, 0)
        this.cameras.main.shake(60, 0.002)
      }
    }

    // Update score & show popup
    this.score += gained
    this.scoreText.setText(`Score: ${this.score}`)
    this.showPopupText(`+${gained}`, this.currentBlock.x, this.currentBlock.y - 40)

    // Register in stack + allow future landings on it
    const body = this.currentBlock.body as MatterJS.BodyType
    this.stack.add({
      x: this.currentBlock.x,
      y: this.currentBlock.y,
      width: this.currentBlock.width,
      height: this.currentBlock.height,
      body
    })
    this.validSurfaces.add(body)

    // Next block
    this.currentBlock = null
    this.spawnBlock()
  }

  private showPopupText(text: string, x: number, y: number): void {
    const t = this.add.text(x, y, text, { fontSize: '20px', color: '#2C3E50' }).setOrigin(0.5)
    t.setDepth(10)
    this.tweens.add({
      targets: t,
      y: y - 40,
      alpha: 0,
      duration: 600,
      ease: 'Quad.out',
      onComplete: () => t.destroy()
    })
  }

  private updateCameraTarget(): void {
    const { height } = this.scale
    const topY = this.stack.topY()
    if (!Number.isFinite(topY)) {
      this.followDot.setPosition(this.followDot.x, height / 2)
      return
    }
    const targetY = Math.min(this.followDot.y, topY) // move up only
    this.followDot.setPosition(this.followDot.x, targetY)
  }
}
