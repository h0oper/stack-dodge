export interface GameData {
  highScore: number
  totalGamesPlayed: number
  averageScore: number
  bestStreak: number
  soundEnabled: boolean
  lastPlayedDate: string
  gameVersion: string
}

const KEY = 'stackdodge_gamedata_v1'

const DEFAULT_DATA: GameData = {
  highScore: 0,
  totalGamesPlayed: 0,
  averageScore: 0,
  bestStreak: 0,
  soundEnabled: true,
  lastPlayedDate: new Date().toISOString(),
  gameVersion: '0.1.0'
}

export class StorageManager {
  static getData(): GameData {
    try {
      const raw = localStorage.getItem(KEY)
      if (!raw) return { ...DEFAULT_DATA }
      const parsed = JSON.parse(raw) as GameData
      return { ...DEFAULT_DATA, ...parsed }
    } catch {
      return { ...DEFAULT_DATA }
    }
  }

  static saveData(patch: Partial<GameData>): void {
    try {
      const cur = StorageManager.getData()
      const upd = { ...cur, ...patch, lastPlayedDate: new Date().toISOString() }
      localStorage.setItem(KEY, JSON.stringify(upd))
    } catch {
      /* no-op */
    }
  }

  static updateHighScore(score: number): boolean {
    const cur = StorageManager.getData()
    if (score > cur.highScore) {
      StorageManager.saveData({ highScore: score })
      return true
    }
    return false
  }

  static recordGamePlayed(score: number): void {
    const cur = StorageManager.getData()
    const total = cur.totalGamesPlayed + 1
    const avg = Math.round(((cur.averageScore * cur.totalGamesPlayed) + score) / total)
    StorageManager.saveData({ totalGamesPlayed: total, averageScore: avg })
  }
}
