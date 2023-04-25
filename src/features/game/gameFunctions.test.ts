import { describe, expect, test } from 'vitest'
import { defaultCell } from '../board/cell/cellFunctions'
import type { HiddenCell, RevealedCell } from '../board/cell/types'
import type { Board } from '../board/types'
import { determineBoardState } from './gameFunctions'
import type { BoardState } from './types'

const correctlyFlaggedCell: HiddenCell = {
  state: 'hidden',
  hasMine: true,
  markedAs: 'flagged',
  roundedCorners: [],
}

const correctlyRevealedCell: RevealedCell = {
  state: 'revealed',
  hasMine: false,
  neighboringMines: 0,
}

const incorrectlyRevealedCell: RevealedCell = {
  ...correctlyRevealedCell,
  hasMine: true,
}

const uninitializedBoard: Board = {
  cells: [],
  initialized: false,
  mineCount: 0,
}

const wonBoard: Board = {
  cells: [
    [correctlyFlaggedCell, correctlyFlaggedCell, correctlyRevealedCell],
    [correctlyFlaggedCell, correctlyRevealedCell, correctlyRevealedCell],
  ],
  initialized: true,
  mineCount: 3,
}

const lostBoard: Board = {
  cells: [
    [incorrectlyRevealedCell, correctlyFlaggedCell, correctlyFlaggedCell],
    [correctlyRevealedCell, correctlyRevealedCell, correctlyFlaggedCell],
  ],
  initialized: true,
  mineCount: 4,
}

const inProgressBoard: Board = {
  cells: [
    [defaultCell(), defaultCell(), defaultCell()],
    [correctlyRevealedCell, correctlyRevealedCell, correctlyFlaggedCell],
  ],
  initialized: true,
  mineCount: 3,
}

describe('Game functions', () => {
  describe('determineBoardState', () => {
    test('returns "uninitialized" if board is not yet initialized', () => {
      expect(determineBoardState(uninitializedBoard)).toBe<BoardState>(
        'uninitialized'
      )
    })

    test('returns "won" if all cells are either correctly flagged or revealed', () => {
      expect(determineBoardState(wonBoard)).toBe<BoardState>('won')
    })

    test('returns "lost" if at least one cell is revealed incorrectly', () => {
      expect(determineBoardState(lostBoard)).toBe<BoardState>('lost')
    })

    test('returns "in-progress" otherwise', () => {
      expect(determineBoardState(inProgressBoard)).toBe<BoardState>(
        'in-progress'
      )
    })
  })
})
