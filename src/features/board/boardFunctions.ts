import produce from 'immer'
import { type Result, resultError, resultOk } from '../../utils/Result'
import { type Board, type Cell, type HiddenCell } from './boardSlice'

export interface Coordinate {
  x: number
  y: number
}

const defaultCell = (): HiddenCell => ({
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
    minesCount: 0
  }
}

const randomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min) + min)
export const randomCoord = (width: number, height: number): Coordinate => ({
  x: randomInt(0, width),
  y: randomInt(0, height)
})

export const scatterMines = (board: Board, minesCount: number): Result<Board> => {
  const width = getWidth(board)
  const height = getHeight(board)

  if (width * height < minesCount) return resultError(`Cannot fit ${minesCount} mines in this board!`)

  const coords: Coordinate[] = []

  do {
    const coordToAdd = randomCoord(width, height)

    if (coords.every(({ x, y }) => coordToAdd.x !== x && coordToAdd.y !== y)) { coords.push(coordToAdd) }
  } while (coords.length < minesCount)

  const cells = produce(board.cells, (cells) => {
    for (const { x, y } of coords) {
      cells[y][x].hasMine = true
    }
  })

  return resultOk({
    cells,
    minesCount
  })
}
