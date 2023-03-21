import { describe, expect, test } from 'vitest'
import { markCell, defaultCell, revealCell } from './cellFunctions'
import type { Cell, HiddenCell, MarkType, RevealedCell } from './types'

describe('cellFunctions', () => {
  describe('defaultCell', () => {
    test('returns correct default cell', () => {
      expect(defaultCell()).toEqual<HiddenCell>({
        state: 'hidden',
        hasMine: false,
        markedAs: 'none',
        roundedCorners: []
      })
    })
  })

  describe('markCell', () => {
    test('just returns the revealed cell', () => {
      const cell: RevealedCell = {
        state: 'revealed',
        hasMine: false,
        neighboringMines: 0
      }
      expect(markCell(cell)).toEqual(cell)
    })

    test('returns the hidden cell with a different marking', () => {
      const startingCell: Cell = {
        state: 'hidden',
        hasMine: false,
        markedAs: 'none',
        roundedCorners: []
      }
      let cell: Cell = { ...startingCell }

      const expectedMarkings: MarkType[] = ['flagged', 'unknown', 'none']
      for (const expectedMarking of expectedMarkings) {
        cell = markCell(cell)
        expect(cell).toEqual({ ...startingCell, markedAs: expectedMarking })
      }
    })
  })

  describe('revealCell', () => {
    test('returns the revealed cell with the given number of neighboring mines', () => {
      expect(revealCell(defaultCell(), 5)).toEqual<RevealedCell>({
        state: 'revealed',
        hasMine: defaultCell().hasMine,
        neighboringMines: 5
      })
    })
  })
})
