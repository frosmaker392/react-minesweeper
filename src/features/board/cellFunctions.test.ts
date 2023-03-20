import { describe, expect, test } from 'vitest'
import { cycleCellMarking, defaultCell } from './cellFunctions'
import type { Cell, HiddenCell, MarkType, RevealedCell } from './types'

describe('cellFunctions', () => {
  describe('defaultCell', () => {
    test('returns correct default cell', () => {
      expect(defaultCell()).toEqual<HiddenCell>({
        state: 'hidden',
        hasMine: false,
        markedAs: 'none'
      })
    })
  })

  describe('cycleCellMarking', () => {
    test('just returns the revealed cell', () => {
      const cell: RevealedCell = {
        state: 'revealed',
        hasMine: false,
        neighboringMines: 0
      }
      expect(cycleCellMarking(cell)).toEqual(cell)
    })

    test('returns the hidden cell with a different marking', () => {
      const startingCell: Cell = {
        state: 'hidden',
        hasMine: false,
        markedAs: 'none'
      }
      let cell: Cell = { ...startingCell }

      const expectedMarkings: MarkType[] = ['flagged', 'unknown', 'none']
      for (const expectedMarking of expectedMarkings) {
        cell = cycleCellMarking(cell)
        expect(cell).toEqual({ ...startingCell, markedAs: expectedMarking })
      }
    })
  })
})
