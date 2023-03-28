import * as A from 'fp-ts/lib/Array'
import * as P from 'fp-ts/lib/Predicate'
import { pipe } from 'fp-ts/lib/function'
import type { Board, Cell } from '../board/types'
import type { GameState } from './types'
import { isHidden, isRevealed } from '../board/cellFunctions'

const correctlyFlagged = (cell: Cell): boolean =>
  isHidden(cell) && cell.markedAs === 'flagged' && cell.hasMine

const correctlyRevealed = (cell: Cell): boolean =>
  isRevealed(cell) && !cell.hasMine

const isWon = (board: Board): boolean =>
  pipe(board.cells, A.every(A.every(P.or(correctlyFlagged)(correctlyRevealed))))

const isLost = (board: Board): boolean =>
  pipe(board.cells, A.some(A.some(P.and(isRevealed)((cell) => cell.hasMine))))

export const determineGameState = (board: Board): GameState => {
  if (!board.initialized) return 'uninitialized'
  if (isWon(board)) return 'won'
  if (isLost(board)) return 'lost'

  return 'in-progress'
}
