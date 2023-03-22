import * as A from 'fp-ts/Array'
import * as E from 'fp-ts/Either'
import { flow, pipe } from 'fp-ts/lib/function'
import { Ord as NumOrd } from 'fp-ts/lib/number'
import { contramap, type Ord } from 'fp-ts/lib/Ord'
import * as O from 'fp-ts/Option'
import { describe, test, expect } from 'vitest'

import { positionWithinBounds, generateBoard, getHeight, getWidth, randomPosition, initializeBoard, getCellAt, placeMines, getNeighborPositions, revealCellAt, markCellAt } from './boardFunctions'
import { defaultCell } from './cellFunctions'
import type { Board, BoardParams, Cell, RevealedCell, Vector2 } from './types'

const defaultCells = (length: number): Cell[] => Array(length).fill(null).map(defaultCell)

const testBoard: Board = {
  cells: [
    defaultCells(7),
    defaultCells(7)
  ],
  mineCount: 0,
  initialized: false
}

// Helper functions
const countMines = (board: Board): number => board.cells.reduce(
  (mineCount, row) => mineCount + row.reduce(
    (mineCount, cell) => mineCount + (cell.hasMine ? 1 : 0),
    0
  ),
  0
)

const hasMineAt = (position: Vector2) => flow(
  getCellAt(position),
  O.exists(cell => cell.hasMine)
)

const toVector2s = (pairs: Array<[number, number]>): Vector2[] => pairs.map(([x, y]) => ({ x, y }))

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
      expect(getCellAt({ x: -1, y: 0 })(testBoard)).toEqual(O.none)
    })

    test('returns cell at specified position', () => {
      expect(getCellAt({ x: 0, y: 0 })(testBoard)).toEqual(O.some(defaultCell()))
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
      expect(positionWithinBounds({ x, y })(testBoard)).toBe(expected)
    })
  })

  describe('generateBoard', () => {
    test('returns error if mine count >= number of available cells', () => {
      const params1: BoardParams = {
        width: 5,
        height: 5,
        mineCount: 25
      }
      const params2: BoardParams = { ...params1, mineCount: 99 }
      expect(pipe(params1, generateBoard, E.isLeft)).toBeTruthy()
      expect(pipe(params2, generateBoard, E.isLeft)).toBeTruthy()
    })

    test('returns board with correct dimensions and expected mine count', () => {
      const params = {
        width: 4,
        height: 9,
        mineCount: 3
      }
      const result = generateBoard(params)
      expect(E.isRight(result)).toBeTruthy()

      const board = (result as E.Right<Board>).right

      expect(getWidth(board)).toBe(params.width)
      expect(getHeight(board)).toBe(params.height)
      expect(board.mineCount).toBe(params.mineCount)
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
      const positions: Vector2[] = toVector2s([
        [0, 0],
        [1, 1],
        [2, 1],
        [7, 8],
        [6, 1]
      ])

      const board = placeMines(positions)(testBoard)
      const validPositions =
        A.filter<Vector2>(
          position => positionWithinBounds(position)(board)
        )(positions)

      for (const position of validPositions) {
        expect(hasMineAt(position)(board)).toBeTruthy()
      }
      expect(countMines(board)).toBe(validPositions.length)
      expect(board.initialized).toBe(false) // Initialized should remain unchanged
    })
  })

  describe('initializeBoard', () => {
    test('returns resulting board with correct number of mines', () => {
      const mineCount = 12
      const board = initializeBoard({ x: 0, y: 1 })({ ...testBoard, mineCount })
      expect(countMines(board)).toBe(mineCount)
      expect(board.mineCount).toBe(mineCount)
    })

    test('returned board never has a mine at excludePosition', () => {
      const excludePosition: Vector2 = { x: 0, y: 1 }
      const mineCount = getWidth(testBoard) * getHeight(testBoard) - 1

      for (let i = 0; i < 10; i++) {
        const board = initializeBoard(excludePosition)({ ...testBoard, mineCount })
        expect(hasMineAt(excludePosition)(board)).toBeFalsy()
      }
    })
  })

  describe('markCellAt', () => {
    test('returns the same board if coordinates are out of bounds', () => {
      expect(markCellAt({ x: -1, y: -1 })(testBoard)).toEqual(testBoard)
    })

    test('returns a board with a cell marked at the specified coordinate', () => {
      const position = { x: 1, y: 1 }
      const board = markCellAt(position)(testBoard)

      expect(pipe(
        getCellAt(position)(board),
        O.map(cell => cell.state === 'hidden' && cell.markedAs === 'flagged')
      )).toEqual(O.some(true))
    })
  })

  describe('getNeighborPositions', () => {
    test('returns empty array for a position out of bounds', () => {
      expect(getNeighborPositions({ x: -1, y: 1 })(testBoard)).toEqual([])
    })

    test('returns correct positions of directly neighboring cells', () => {
      const neighborPositions = getNeighborPositions({ x: 5, y: 0 })(testBoard)
      const expected: Vector2[] = toVector2s([
        [4, 0], [6, 0],
        [4, 1], [5, 1], [6, 1]
      ])

      const ordX: Ord<Vector2> = pipe(
        NumOrd,
        contramap(({ x }) => x)
      )
      const ordY: Ord<Vector2> = pipe(
        NumOrd,
        contramap(({ y }) => y)
      )
      const v2Sorter = A.sortBy([ordX, ordY])
      expect(v2Sorter(neighborPositions)).toEqual(v2Sorter(expected))
    })
  })

  describe('revealCellAt', () => {
    describe('returns unchanged board if cell at position...', () => {
      test('...does not exist', () => {
        expect(revealCellAt({ x: -1, y: -1 })(testBoard)).toEqual(testBoard)
      })

      test('...is already flagged', () => {
        const position = { x: 0, y: 0 }
        const board: Board = markCellAt(position)(testBoard)
        expect(revealCellAt(position)(board)).toEqual(board)
      })

      test('...is marked as unknown', () => {
        const position = { x: 0, y: 0 }
        const board = pipe(
          testBoard,
          markCellAt(position),
          markCellAt(position)
        )
        expect(revealCellAt(position)(board)).toEqual(board)
      })
    })

    const testBoard: Board = {
      cells: [
        defaultCells(3),
        defaultCells(3),
        defaultCells(3)
      ],
      mineCount: 0,
      initialized: false
    }

    test('returns board which is initialized and revealed at position', () => {
      const board = revealCellAt({ x: 0, y: 0 })({ ...testBoard, mineCount: 5 })
      expect(board.initialized).toBeTruthy()
    })

    test('revealed cell contains correct number of neighboring mines', () => {
      const minePositions = toVector2s([
        [1, 0],
        [0, 1],
        [2, 1],
        [2, 2]
      ])
      const positionToReveal = { x: 1, y: 1 }
      const board = pipe(
        { ...testBoard, mineCount: 4, initialized: true },
        placeMines(minePositions),
        revealCellAt(positionToReveal)
      )

      expect(getCellAt(positionToReveal)(board)).toEqual(O.some<RevealedCell>({
        state: 'revealed',
        neighboringMines: 4,
        hasMine: false
      }))
    })

    test('if number of neighboring flags match that of mines, reveal any unmarked neighbor cells', () => {
      const minePositions = toVector2s([
        [1, 0],
        [0, 1]
      ])
      const positionToReveal: Vector2 = { x: 1, y: 1 }
      const board = pipe(
        { ...testBoard, mineCount: 2, initialized: true },
        placeMines(minePositions),
        revealCellAt(positionToReveal),
        markCellAt(minePositions[0]),
        markCellAt(minePositions[1]),
        revealCellAt(positionToReveal)
      )

      expect(getCellAt(positionToReveal)(board)).toEqual(O.some<RevealedCell>({
        state: 'revealed',
        neighboringMines: 2,
        hasMine: false
      }))
    })
  })
})
