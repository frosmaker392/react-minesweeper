import type { Board } from '../board/types'

export type BoardState = 'uninitialized' | 'in-progress' | 'won' | 'lost'

export interface GameState {
  board: Board
  boardState: BoardState
  isPaused: boolean
  flaggedCellsCount: number
}
