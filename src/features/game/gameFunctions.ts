import * as A from 'fp-ts/lib/Array'
import * as P from 'fp-ts/lib/Predicate'
import { pipe } from 'fp-ts/lib/function'
import type { Board } from '../board/types'
import type { BoardState } from './types'
import { isHidden, isRevealed } from '../board/cell/cellFunctions'
import type { Cell } from '../board/cell/types'

const correctlyFlagged = (cell: Cell): boolean =>
  isHidden(cell) && cell.markedAs === 'flagged' && cell.hasMine

const correctlyRevealed = (cell: Cell): boolean =>
  isRevealed(cell) && !cell.hasMine

const isWon = (board: Board): boolean =>
  pipe(board.cells, A.every(A.every(P.or(correctlyFlagged)(correctlyRevealed))))

const isLost = (board: Board): boolean =>
  pipe(board.cells, A.some(A.some(P.and(isRevealed)((cell) => cell.hasMine))))

export const determineBoardState = (board: Board): BoardState => {
  if (!board.initialized) return 'uninitialized'
  if (isWon(board)) return 'won'
  if (isLost(board)) return 'lost'

  return 'in-progress'
}
