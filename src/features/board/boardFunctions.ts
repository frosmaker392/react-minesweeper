import produce from 'immer'
import { mapOption, type Option } from '../../utils/Option'
import { type Result, errorResult, okResult } from '../../utils/Result'
import { cycleCellMarking, defaultCell } from './cellFunctions'
import type { Vector2, Board, Cell, RevealedCell } from './types'

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

export const generateBoard = (width: number, height: number, mineCount: number): Result<Board> => {
  if (width * height < mineCount) return errorResult(`Cannot fit ${mineCount} mines in this board!`)

  const cells: Cell[][] = Array(height)
    .fill(null)
    .map(() => Array(width)
      .fill(null)
      .map(defaultCell))

  return okResult({
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
  return mapOption(getCellAt(board, position), (cell) => {
    const { x, y } = position

    return produce(board, board => {
      const newCell = cycleCellMarking(cell)
      board.cells[y][x] = newCell
    })
  }) ?? board
}

export const getNeighborPositions = (board: Board, position: Vector2): Vector2[] => {
  const { x, y } = position
  return neighboringCellOffsets
    .map(([xOff, yOff]) => ({ x: x + xOff, y: y + yOff }))
    .filter(neighborPos => positionWithinBounds(board, neighborPos))
}

export const getNeighboringMineCount = (board: Board, position: Vector2): number => {
  const neighboringCells = getNeighborPositions(board, position)
    .map(p => getCellAt(board, p)) as Cell[]

  return neighboringCells.filter(cell => cell.hasMine).length
}

export const getNeighboringFlagCount = (board: Board, position: Vector2): number => {
  const neighboringCells = getNeighborPositions(board, position)
    .map(p => getCellAt(board, p)) as Cell[]

  return neighboringCells
    .filter(cell => cell.state === 'hidden' && cell.markedAs === 'flagged').length
}

export const revealCellAt = (board: Board, position: Vector2): Board => {
  const cell = getCellAt(board, position)
  if (cell === undefined ||
    cell.state === 'revealed' ||
    (cell.state === 'hidden' && cell.markedAs !== 'none')) {
    return board
  }

  if (!board.initialized) return revealCellAt(initializeBoard(board, position), position)

  return produce(board, board => {
    // Breadth-first search from given position
    const queue = [position]

    while (queue.length > 0) {
      const currentPosition = queue.pop() ?? { x: -1, y: -1 }

      const neighborPositions = getNeighborPositions(board, currentPosition)
      const neighboringMineCount = getNeighboringMineCount(board, currentPosition)
      const neighboringFlagCount = getNeighboringFlagCount(board, currentPosition)

      // Reveal cell at current position
      const { x, y } = currentPosition
      const { hasMine } = board.cells[y][x]
      board.cells[y][x] = {
        state: 'revealed',
        neighboringMines: neighboringMineCount,
        hasMine
      } satisfies RevealedCell

      // Then propagate cell reveal outwards if flag and mine counts match
      if (neighboringFlagCount === neighboringMineCount) {
        neighborPositions
          .filter(neighborPosition => getCellAt(board, neighborPosition)?.state === 'hidden')
          .forEach(neighborPosition => queue.push(neighborPosition))
      }
    }
  })
}
