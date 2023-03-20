import produce from 'immer'
import { mapOption, type Option } from '../../utils/Option'
import { type Result, errorResult, okResult } from '../../utils/Result'
import { cycleCellMarking, defaultCell } from './cellFunctions'
import type { Vector2, Board, Cell } from './types'

const randomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min) + min)
export const randomPosition = (width: number, height: number): Vector2 => ({
  x: randomInt(0, width),
  y: randomInt(0, height)
})

export const getWidth = (board: Board): number => {
  const row = board.cells.at(0)
  return row === undefined ? 0 : row.length
}

export const getHeight = (board: Board): number => board.cells.length

export const getCellAt = (board: Board, position: Vector2): Option<Cell> => {
  if (!positionWithinBounds(board, position)) return undefined

  const { x, y } = position
  return board.cells[y][x]
}

export const positionWithinBounds = (board: Board, { x, y }: Vector2): boolean => {
  const width = getWidth(board)
  const height = getHeight(board)

  return x >= 0 && x < width && y >= 0 && y < height
}

export const generateEmptyBoard = (width: number, height: number): Board => {
  const cells: Cell[][] = Array(height)
    .fill(null)
    .map(() => Array(width)
      .fill(null)
      .map(defaultCell))

  return {
    cells,
    mineCount: 0
  }
}

export const placeMines = (board: Board, positions: Vector2[]): Board => {
  return produce(board, board => {
    for (const position of positions) {
      const { x, y } = position
      if (positionWithinBounds(board, position)) board.cells[y][x].hasMine = true
    }
  })
}

export const initializeBoard = (board: Board, mineCount: number, excludePosition: Vector2): Result<Board> => {
  const width = getWidth(board)
  const height = getHeight(board)

  if (width * height < mineCount) return errorResult(`Cannot fit ${mineCount} mines in this board!`)

  const positions: Vector2[] = []

  while (positions.length < mineCount) {
    const { x: xN, y: yN } = randomPosition(width, height)

    const shouldAdd = positions.every(({ x, y }) => !(xN === x && yN === y)) &&
      !(excludePosition.x === xN && excludePosition.y === yN)
    if (shouldAdd) positions.push({ x: xN, y: yN })
  }

  return okResult({
    ...placeMines(board, positions),
    mineCount
  })
}

export const markCellAt = (board: Board, position: Vector2): Board => {
  return mapOption(getCellAt(board, position), (cell) => {
    const { x, y } = position

    return produce(board, board => {
      const newCell = cycleCellMarking(cell)
      board.cells[y][x] = newCell
    })
  }) ?? board
}
