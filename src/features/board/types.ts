export interface Vector2 {
  x: number
  y: number
}

export type MarkType = 'none' | 'flagged' | 'unknown'

export interface HiddenCell {
  state: 'hidden'
  hasMine: boolean
  markedAs: MarkType
}

export interface RevealedCell {
  state: 'revealed'
  hasMine: boolean
  neighboringMines: number
}

export type Cell = HiddenCell | RevealedCell

export interface Board {
  mineCount: number
  cells: Cell[][]
}
