import { filter } from 'fp-ts/lib/Array'
import * as E from 'fp-ts/lib/Either'
import { flow, pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'
import produce from 'immer'
import { markCell, defaultCell, revealCell } from './cellFunctions'
import type { Vector2, Board, Cell, BoardParams } from './types'

type BoardResult = E.Either<string, Board>

const randomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min) + min)

const neighboringCellOffsets = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1]
]

export const randomPosition = (width: number, height: number): Vector2 => ({
  x: randomInt(0, width),
  y: randomInt(0, height)
})

export const getWidth = (board: Board): number => {
  const row = board.cells.at(0)
  return row === undefined ? 0 : row.length
}

export const getHeight = (board: Board): number => board.cells.length

export const getCellAt = (board: Board, position: Vector2): O.Option<Cell> => {
  if (!positionWithinBounds(board, position)) return O.none

  const { x, y } = position
  return O.some(board.cells[y][x])
}

export const positionWithinBounds = (board: Board, { x, y }: Vector2): boolean => {
  const width = getWidth(board)
  const height = getHeight(board)

  return x >= 0 && x < width && y >= 0 && y < height
}

export const generateBoard = ({ width, height, mineCount }: BoardParams): BoardResult => {
  if (width * height <= mineCount) return E.left(`Cannot fit ${mineCount} mines in this board!`)

  const cells: Cell[][] = Array(height)
    .fill(null)
    .map(() => Array(width)
      .fill(null)
      .map(defaultCell))

  return E.right({
    cells,
    mineCount,
    initialized: false
  })
}

export const placeMines = (board: Board, positions: Vector2[]): Board => {
  return produce(board, board => {
    for (const position of positions) {
      const { x, y } = position
      if (positionWithinBounds(board, position)) board.cells[y][x].hasMine = true
    }
  })
}

export const initializeBoard = (board: Board, excludePosition: Vector2): Board => {
  const width = getWidth(board)
  const height = getHeight(board)

  const positions: Vector2[] = []

  while (positions.length < board.mineCount) {
    const { x: xN, y: yN } = randomPosition(width, height)

    const shouldAdd = positions.every(({ x, y }) => !(xN === x && yN === y)) &&
      !(excludePosition.x === xN && excludePosition.y === yN)
    if (shouldAdd) positions.push({ x: xN, y: yN })
  }

  return {
    ...placeMines(board, positions),
    initialized: true
  }
}

export const markCellAt = (board: Board, position: Vector2): Board => {
  return pipe(
    getCellAt(board, position),
    O.map<Cell, Board>((cell) => {
      const { x, y } = position

      return produce(board, board => {
        const newCell = markCell(cell)
        board.cells[y][x] = newCell
      })
    }),
    O.getOrElse(() => board)
  )
}

export const getNeighborPositions = (board: Board, position: Vector2): Vector2[] => {
  if (!positionWithinBounds(board, position)) return []
  const { x, y } = position
  return neighboringCellOffsets
    .map(([xOff, yOff]) => ({ x: x + xOff, y: y + yOff }))
    .filter(neighborPos => positionWithinBounds(board, neighborPos))
}

export const getNeighboringCells = (board: Board, position: Vector2): Cell[] => {
  return getNeighborPositions(board, position)
    .map(nPos => flow(getCellAt, O.toUndefined)(board, nPos))
    .filter((cell): cell is Cell => cell !== undefined)
}

export const revealCellAt = (board: Board, position: Vector2): Board => {
  const countNeighboringMines = flow(
    getNeighboringCells,
    filter(cell => cell.hasMine),
    cells => cells.length
  )

  const countNeighboringFlags = flow(
    getNeighboringCells,
    filter(cell => cell.state === 'hidden' && cell.markedAs === 'flagged'),
    cells => cells.length
  )

  return pipe(
    getCellAt(board, position),
    O.filterMap(cell => {
      if (cell.state === 'hidden' && cell.markedAs !== 'none') return O.none

      if (!board.initialized) {
        return flow(
          initializeBoard,
          O.some
        )(board, position)
      }

      return O.some(board)
    }),
    O.map(board => produce(board, board => {
      // Breadth-first search from given position
      const queue = [position]

      while (queue.length > 0) {
        const currentPosition = queue.pop() ?? { x: -1, y: -1 }

        const neighborPositions = getNeighborPositions(board, currentPosition)
        const neighboringMineCount = countNeighboringMines(board, position)
        const neighboringFlagCount = countNeighboringFlags(board, currentPosition)

        // Reveal cell at current position
        const { x, y } = currentPosition
        board.cells[y][x] = revealCell(board.cells[y][x], neighboringMineCount)

        // Then propagate cell reveal outwards if flag and mine counts match
        if (neighboringFlagCount === neighboringMineCount) {
          const hiddenCellPositions = pipe(
            neighborPositions,
            filter(nPos => pipe(
              getCellAt(board, nPos),
              O.filterMap(cell => cell.state === 'hidden' ? O.none : O.some(cell)),
              O.isSome
            ))
          )

          for (const position of hiddenCellPositions) {
            queue.push(position)
          }
        }
      }
    })),
    O.getOrElse(() => board)
  )
}
