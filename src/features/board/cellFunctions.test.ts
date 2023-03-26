import * as O from 'fp-ts/lib/Option'
import { describe, expect, test } from 'vitest'
import {
  markCell,
  defaultCell,
  revealCell,
  calculateRoundedCorners,
  isHidden,
} from './cellFunctions'
import type {
  Cell,
  HiddenCell,
  MarkType,
  NeighboringStates,
  RevealedCell,
} from './types'

describe('cellFunctions', () => {
  describe('isHidden', () => {
    test('returns true if cell is a HiddenCell', () => {
      expect(isHidden(defaultCell())).toBe(true)
      expect(
        isHidden({
          state: 'revealed',
          neighboringMines: 0,
          hasMine: false,
        })
      ).toBe(false)
    })
  })

  describe('defaultCell', () => {
    test('returns correct default cell', () => {
      expect(defaultCell()).toEqual<HiddenCell>({
        state: 'hidden',
        hasMine: false,
        markedAs: 'none',
        roundedCorners: [],
      })
    })
  })

  describe('markCell', () => {
    test('just returns the revealed cell', () => {
      const cell: RevealedCell = {
        state: 'revealed',
        hasMine: false,
        neighboringMines: 0,
      }
      expect(markCell(cell)).toEqual(cell)
    })

    test('returns the hidden cell with a different marking', () => {
      const startingCell: Cell = {
        state: 'hidden',
        hasMine: false,
        markedAs: 'none',
        roundedCorners: [],
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
      expect(revealCell(5)(defaultCell())).toEqual({
        state: 'revealed',
        hasMine: defaultCell().hasMine,
        neighboringMines: 5,
      } satisfies RevealedCell)
    })
  })

  describe('calculateRoundedCorners', () => {
    test('returns cell with correct rounded corners given states of neighboring cells which exist', () => {
      const nStates1: NeighboringStates = {
        top: O.some('revealed'),
        bottom: O.some('hidden'),
        left: O.some('revealed'),
        right: O.some('revealed'),
      }
      const nStates2: NeighboringStates = {
        top: O.some('hidden'),
        bottom: O.some('hidden'),
        left: O.some('revealed'),
        right: O.some('revealed'),
      }

      expect(calculateRoundedCorners(nStates1)(defaultCell())).toEqual({
        ...defaultCell(),
        roundedCorners: ['topLeft', 'topRight'],
      } satisfies HiddenCell)
      expect(calculateRoundedCorners(nStates2)(defaultCell())).toEqual(
        defaultCell()
      )
    })

    test('assumes non-existing neighbor cells to be hidden', () => {
      const nStates: NeighboringStates = {
        top: O.none,
        bottom: O.some('revealed'),
        left: O.none,
        right: O.some('revealed'),
      }

      expect(calculateRoundedCorners(nStates)(defaultCell())).toEqual({
        ...defaultCell(),
        roundedCorners: ['bottomRight'],
      })
    })
  })
})
