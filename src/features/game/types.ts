import type { Board, BoardParams } from '../board/types'
import type { Difficulty } from '../menu/types'

export type BoardState = 'uninitialized' | 'in-progress' | 'won' | 'lost'

export interface GameState {
  board: Board
  boardState: BoardState
  boardParams: BoardParams
  difficulty: Difficulty
  isPaused: boolean
  flaggedCellsCount: number
}
