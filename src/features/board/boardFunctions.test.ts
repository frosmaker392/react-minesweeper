import { describe, test, expect } from 'vitest'
import { getResultValue } from '../../utils/Result'
import { positionWithinBounds, generateBoard, getHeight, getWidth, markCellAt, randomPosition, initializeBoard, getCellAt, placeMines, getNeighboringMineCount, getNeighborPositions, getNeighboringFlagCount, revealCellAt } from './boardFunctions'
import { defaultCell } from './cellFunctions'
import type { Board, Cell, RevealedCell, Vector2 } from './types'

const defaultCells = (length: number): Cell[] => Array(length).fill(null).map(defaultCell)

const testBoard: Board = {
  cells: [
    defaultCells(7),
    defaultCells(7)
  ],
  mineCount: 0,
  initialized: false
}

const countMines = (board: Board): number => board.cells.reduce(
  (mineCount, row) => mineCount + row.reduce(
    (mineCount, cell) => mineCount + (cell.hasMine ? 1 : 0),
    0
  ),
  0
)

describe('Board functions', () => {
  describe('randomPosition', () => {
    test('returns a Vector2 with random x, y values with 0 <= x < width and 0 <= y < height', () => {
      const width = 10
      const height = 5
      const coordFactory = (): Vector2 => randomPosition(width, height)
      const positions = Array(10).fill(null).map(coordFactory)

      for (const position of positions) {
        expect(position.x).toBeGreaterThanOrEqual(0)
        expect(position.x).toBeLessThan(width)
        expect(position.y).toBeGreaterThanOrEqual(0)
        expect(position.y).toBeLessThan(height)
      }

      const { x: x1, y: y1 } = positions[0]
      expect(positions.every(({ x }) => x1 === x)).toBeFalsy()
      expect(positions.every(({ y }) => y1 === y)).toBeFalsy()
    })
  })

  describe('getWidth', () => {
    test('returns correct width', () => {
      expect(getWidth(testBoard)).toBe(testBoard.cells[0].length)
    })

    test('returns 0 for an empty board', () => {
      const emptyBoard: Board = {
        cells: [],
        mineCount: 0,
        initialized: false
      }
      expect(getWidth(emptyBoard)).toBe(0)
    })
  })

  describe('getHeight', () => {
    test('returns correct height', () => {
      expect(getHeight(testBoard)).toBe(testBoard.cells.length)
    })
  })

  describe('getCellAt', () => {
    test('return undefined if position is out of bounds', () => {
      expect(getCellAt(testBoard, { x: -1, y: 0 })).toBeUndefined()
    })

    test('returns cell at specified position', () => {
      expect(getCellAt(testBoard, { x: 0, y: 0 })).toEqual(defaultCell())
    })
  })

  describe('positionWithinBounds', () => {
    test.each([
      [0, 0, true],
      [6, 1, true],
      [6, 2, false],
      [7, 1, false],
      [-1, 0, false],
      [0, -1, false]
    ])('positionWithinBounds(<7x2 board>, { x: %i, y: %i }) -> %s', (x, y, expected) => {
      expect(positionWithinBounds(testBoard, { x, y })).toBe(expected)
    })
  })

  describe('generateBoard', () => {
    test('returns board with correct dimensions and expected mine count', () => {
      const result = generateBoard(4, 9, 3)
      expect(result.ok).toBeTruthy()

      const board = getResultValue(result)

      expect(getWidth(board)).toBe(4)
      expect(getHeight(board)).toBe(9)
      expect(board.mineCount).toBe(3)
      expect(board.initialized).toBeFalsy()

      for (const row of board.cells) {
        for (const cell of row) {
          expect(cell).toEqual(defaultCell())
        }
      }
    })
  })

  describe('placeMines', () => {
    test('returns a board with cells with hasMine = true only at valid positions', () => {
      const positions: Vector2[] = [
        [0, 0],
        [1, 1],
        [2, 1],
        [7, 8],
        [6, 1]
      ].map(([x, y]) => ({ x, y }))

      const board = placeMines(testBoard, positions)
      const validPositions = positions.filter((position) => positionWithinBounds(board, position))

      for (const position of validPositions) {
        expect(getCellAt(board, position)?.hasMine).toBeTruthy()
      }
      expect(countMines(board)).toBe(validPositions.length)
    })
  })

  describe('initializeBoard', () => {
    test('returns resulting board with correct number of mines', () => {
      const mineCount = 12
      const board = initializeBoard({ ...testBoard, mineCount }, { x: 0, y: 1 })
      expect(countMines(board)).toBe(mineCount)
      expect(board.mineCount).toBe(mineCount)
    })

    test('returned board never has a mine at excludePosition', () => {
      const excludePosition: Vector2 = { x: 0, y: 1 }
      const mineCount = getWidth(testBoard) * getHeight(testBoard) - 1

      for (let i = 0; i < 10; i++) {
        const board = initializeBoard({ ...testBoard, mineCount }, excludePosition)
        expect(getCellAt(board, excludePosition)).toBeDefined()
        expect(getCellAt(board, excludePosition)?.hasMine).toBeFalsy()
      }
    })
  })

  describe('markCellAt', () => {
    test('returns the same board if coordinates are out of bounds', () => {
      expect(markCellAt(testBoard, { x: -1, y: -1 })).toEqual(testBoard)
    })

    test('returns a board with a cell marked at the specified coordinate', () => {
      const board = markCellAt(testBoard, { x: 1, y: 1 })

      expect(board)
    })
  })

  describe('getNeighborPositions', () => {
    test('returns correct positions of directly neighboring cells', () => {
      const neighborPositions = getNeighborPositions(testBoard, { x: 5, y: 0 })
      const expected: Vector2[] = [
        [4, 0], [6, 0],
        [4, 1], [5, 1], [6, 1]
      ].map(([x, y]) => ({ x, y }))

      expect(neighborPositions.length).toBe(expected.length)
      for (const { x: xN, y: yN } of neighborPositions) {
        expect(expected.some(({ x, y }) => x === xN && y === yN))
      }
    })
  })

  describe('getNeighboringMineCount', () => {
    test('returns correct number of neighboring mines', () => {
      const board = placeMines(testBoard, [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: 1 }
      ])

      expect(getNeighboringMineCount(board, { x: 1, y: 1 })).toBe(3)
    })
  })

  describe('getNeighboringFlagCount', () => {
    test('returns correct number of neighboring flags', () => {
      const board = [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: 1 }
      ].reduce((board, position) => markCellAt(board, position), testBoard)

      expect(getNeighboringFlagCount(board, { x: 1, y: 1 })).toBe(3)
    })
  })

  describe('revealCellAt', () => {
    describe('returns unchanged board if cell at position...', () => {
      test('...is already revealed', () => {
        const board: Board = {
          cells: [
            [
              {
                state: 'revealed',
                hasMine: false,
                neighboringMines: 0
              } satisfies RevealedCell,
              ...defaultCells(6)
            ],
            defaultCells(7)
          ],
          mineCount: 0,
          initialized: true
        }
        expect(revealCellAt(board, { x: 0, y: 0 })).toEqual(board)
      })
    })
  })
})
