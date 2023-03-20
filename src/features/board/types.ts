export interface Vector2 {
  readonly x: number
  readonly y: number
}

export type MarkType = 'none' | 'flagged' | 'unknown'

export interface HiddenCell {
  readonly state: 'hidden'
  readonly hasMine: boolean
  readonly markedAs: MarkType
}

export interface RevealedCell {
  readonly state: 'revealed'
  readonly hasMine: boolean
  readonly neighboringMines: number
}

export type Cell = HiddenCell | RevealedCell

export interface Board {
  readonly initialized: boolean
  readonly mineCount: number
  readonly cells: Cell[][]
}
