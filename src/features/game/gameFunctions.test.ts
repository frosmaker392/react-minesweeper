import { describe, expect, test } from 'vitest'
import { defaultCell } from '../board/cellFunctions'
import type { Board, RevealedCell, HiddenCell } from '../board/types'
import { determineGameState } from './gameFunctions'
import type { GameState } from './types'

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
  describe('determineGameState', () => {
    test('returns "uninitialized" if board is not yet initialized', () => {
      expect(determineGameState(uninitializedBoard)).toBe<GameState>(
        'uninitialized'
      )
    })

    test('returns "won" if all cells are either correctly flagged or revealed', () => {
      expect(determineGameState(wonBoard)).toBe<GameState>('won')
    })

    test('returns "lost" if at least one cell is revealed incorrectly', () => {
      expect(determineGameState(lostBoard)).toBe<GameState>('lost')
    })

    test('returns "in-progress" otherwise', () => {
      expect(determineGameState(inProgressBoard)).toBe<GameState>('in-progress')
    })
  })
})
