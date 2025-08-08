export class AudioManager {
  private static _i: AudioManager
  private scene: Phaser.Scene | null = null
  private enabled = true
  private sounds: Map<string, Phaser.Sound.BaseSound> = new Map()

  static I(): AudioManager {
    if (!this._i) this._i = new AudioManager()
    return this._i
  }

  init(scene: Phaser.Scene) {
    this.scene = scene
  }

  // Load in BootScene: pass list of keys/files
  preload(list: { key: string; path: string }[]) {
    if (!this.scene) return
    for (const s of list) this.scene.load.audio(s.key, s.path)
  }

  // Create actual instances in Menu or Game scene
  create(keys: string[]) {
    if (!this.scene) return
    for (const k of keys) {
      if (!this.sounds.has(k)) {
        const snd = this.scene.sound.add(k, { volume: 0.9 })
        this.sounds.set(k, snd)
      }
    }
  }

  play(key: string, volume = 1.0) {
    if (!this.enabled) return
    const s = this.sounds.get(key)
    s?.play({ volume })
  }

  toggle(): boolean {
    this.enabled = !this.enabled
    return this.enabled
  }

  isEnabled(): boolean {
    return this.enabled
  }
}
