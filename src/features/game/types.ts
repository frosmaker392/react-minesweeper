import type { Difficulty } from '../board/presets/types'
import type { Board, BoardParams } from '../board/types'

export type BoardState = 'uninitialized' | 'in-progress' | 'won' | 'lost'

export interface GameState {
  board: Board
  boardState: BoardState
  boardParams: BoardParams
  difficulty: Difficulty
  flaggedCellsCount: number
}
