// src/objects/Stack.ts
export interface PlacedBlock {
  x: number
  y: number
  width: number
  height: number
  body: MatterJS.BodyType
}

export class Stack {
  private blocks: PlacedBlock[] = []

  add(block: PlacedBlock): void {
    this.blocks.push(block)
  }

  last(): PlacedBlock | null {
    if (this.blocks.length === 0) return null
    return this.blocks[this.blocks.length - 1]
  }

  count(): number {
    return this.blocks.length
  }

  /** Top-most y (screen coords: smaller = higher). Infinity if empty so Math.min works nicely. */
  topY(): number {
    if (this.blocks.length === 0) return Number.POSITIVE_INFINITY
    return Math.min(...this.blocks.map(b => b.y - b.height / 2))
  }
}
