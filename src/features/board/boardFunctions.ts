import produce from 'immer'
import { type Result, errorResult, okResult } from '../../utils/Result'
import { type Board, type Cell, type HiddenCell } from './boardSlice'

export interface Coordinate {
  x: number
  y: number
}

export const defaultCell = (): HiddenCell => ({
  state: 'hidden',
  hasMine: false,
  markedAs: 'none'
})

export const getWidth = (board: Board): number => {
  const row = board.cells.at(0)
  return row === undefined ? 0 : row.length
}

export const getHeight = (board: Board): number => board.cells.length

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

const randomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min) + min)
export const randomCoord = (width: number, height: number): Coordinate => ({
  x: randomInt(0, width),
  y: randomInt(0, height)
})

export const scatterMines = (board: Board, mineCount: number): Result<Board> => {
  const width = getWidth(board)
  const height = getHeight(board)

  if (width * height < mineCount) return errorResult(`Cannot fit ${mineCount} mines in this board!`)

  const coords: Coordinate[] = []

  while (coords.length < mineCount) {
    const coordToAdd = randomCoord(width, height)

    const shouldAdd = !coords.some(({ x, y }) => {
      return coordToAdd.x === x && coordToAdd.y === y
    })
    if (shouldAdd) coords.push(coordToAdd)
  }

  const cells = produce(board.cells, (cells) => {
    for (const { x, y } of coords) {
      cells[y][x].hasMine = true
    }
  })

  return okResult({
    cells,
    mineCount
  })
}
