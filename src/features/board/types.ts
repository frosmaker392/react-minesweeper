import type { Cell } from './cell/types'

export interface Vector2 {
  readonly x: number
  readonly y: number
}

export interface Board {
  readonly initialized: boolean
  readonly mineCount: number
  readonly cells: Cell[][]
}

export interface BoardParams {
  readonly width: number
  readonly height: number
  readonly mineCount: number
}
