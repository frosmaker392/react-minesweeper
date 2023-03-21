export interface Vector2 {
  readonly x: number
  readonly y: number
}

export type MarkType = 'none' | 'flagged' | 'unknown'
export type Corner = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'

interface BaseCell {
  readonly state: 'hidden' | 'revealed'
  readonly hasMine: boolean
}

export interface HiddenCell extends BaseCell {
  readonly state: 'hidden'
  readonly markedAs: MarkType
  readonly roundedCorners: Corner[]
}

export interface RevealedCell extends BaseCell {
  readonly state: 'revealed'
  readonly neighboringMines: number
}

export type Cell = HiddenCell | RevealedCell

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
