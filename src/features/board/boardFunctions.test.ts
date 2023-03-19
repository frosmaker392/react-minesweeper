import { describe, test, expect } from 'vitest'
import { type OkResult } from '../../utils/Result'
import { type Coordinate, defaultCell, generateEmptyBoard, getHeight, getWidth, randomCoord, scatterMines } from './boardFunctions'
import { type Board, type HiddenCell } from './boardSlice'

const testBoard: Board = {
  cells: [
    Array(7).fill(null).map(defaultCell),
    Array(7).fill(null).map(defaultCell)
  ],
  mineCount: 0
}

describe('Board functions', () => {
  describe('defaultCell', () => {
    test('returns correct default cell', () => {
      expect(defaultCell()).toEqual<HiddenCell>({
        state: 'hidden',
        hasMine: false,
        markedAs: 'none'
      })
    })
  })

  describe('getWidth', () => {
    test('returns correct width', () => {
      expect(getWidth(testBoard)).toBe(testBoard.cells[0].length)
    })

    test('returns 0 for an empty board', () => {
      const emptyBoard: Board = {
        cells: [],
        mineCount: 0
      }
      expect(getWidth(emptyBoard)).toBe(0)
    })
  })

  describe('getHeight', () => {
    test('returns correct height', () => {
      expect(getHeight(testBoard)).toBe(testBoard.cells.length)
    })
  })

  describe('generateEmptyBoard', () => {
    test('returns empty board with correct dimensions and contents', () => {
      const board = generateEmptyBoard(4, 9)

      expect(board.mineCount).toBe(0)
      expect(getWidth(board)).toBe(4)
      expect(getHeight(board)).toBe(9)

      for (const row of board.cells) {
        for (const cell of row) {
          expect(cell).toEqual(defaultCell())
        }
      }
    })
  })

  describe('randomCoord', () => {
    test('returns a Coordinate object with random x, y values with 0 <= x < width and 0 <= y < height', () => {
      const width = 10
      const height = 5
      const coordFactory = (): Coordinate => randomCoord(width, height)
      const coords = Array(10).fill(null).map(coordFactory)

      for (const coord of coords) {
        expect(coord.x).toBeGreaterThanOrEqual(0)
        expect(coord.x).toBeLessThan(width)
        expect(coord.y).toBeGreaterThanOrEqual(0)
        expect(coord.y).toBeLessThan(height)
      }

      const { x: x1, y: y1 } = coords[0]
      expect(coords.every(({ x }) => x1 === x)).toBeFalsy()
      expect(coords.every(({ y }) => y1 === y)).toBeFalsy()
    })
  })

  describe('scatterMines', () => {
    test('returns error if minesCount is greater than the number of available cells', () => {
      expect(scatterMines(testBoard, 99).ok).toBeFalsy()
    })

    test('returns resulting board with correct number of mines', () => {
      const mineCount = 12
      const result = scatterMines(testBoard, mineCount)

      expect(result.ok).toBeTruthy()

      const board = (result as OkResult<Board>).value

      const resultingMineCount = board.cells.reduce(
        (mineCount, row) => mineCount + row.reduce(
          (mineCount, cell) => mineCount + (cell.hasMine ? 1 : 0),
          0
        ),
        0
      )
      expect(resultingMineCount).toBe(mineCount)
    })
  })
})
