import { describe, it, expect, beforeEach } from 'vitest'
import { StorageManager } from '../src/managers/StorageManager'

describe('StorageManager', () => {
  const KEY = 'stackdodge_gamedata_v1'

  beforeEach(() => {
    // reset localStorage between tests
    localStorage.clear()
  })

  it('initializes with defaults', () => {
    const data = StorageManager.getData()
    expect(data.highScore).toBe(0)
    expect(data.totalGamesPlayed).toBe(0)
  })

  it('updates high score when larger', () => {
    const changed = StorageManager.updateHighScore(100)
    expect(changed).toBe(true)
    const d = StorageManager.getData()
    expect(d.highScore).toBe(100)
  })

  it('does not update high score when lower', () => {
    StorageManager.updateHighScore(100)
    const changed = StorageManager.updateHighScore(10)
    expect(changed).toBe(false)
    const d = StorageManager.getData()
    expect(d.highScore).toBe(100)
  })

  it('records game played and updates average', () => {
    StorageManager.recordGamePlayed(100)
    StorageManager.recordGamePlayed(50)
    const d = StorageManager.getData()
    expect(d.totalGamesPlayed).toBe(2)
    expect(d.averageScore).toBe(75)
  })
})
