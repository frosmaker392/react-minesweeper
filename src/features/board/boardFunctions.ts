import * as A from 'fp-ts/lib/Array'
import * as E from 'fp-ts/lib/Either'
import { flow, pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'
import produce from 'immer'
import {
  markCell,
  defaultCell,
  revealCell,
  calculateRoundedCorners,
  isHidden,
} from './cellFunctions'
import type {
  Vector2,
  Board,
  Cell,
  BoardParams,
  NeighboringStates,
  HiddenCell,
} from './types'

type BoardResult = E.Either<string, Board>

const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min) + min)

export const randomPosition = (width: number, height: number): Vector2 => ({
  x: randomInt(0, width),
  y: randomInt(0, height),
})

export const getWidth = (board: Board): number =>
  pipe(
    A.head(board.cells),
    O.map(A.size),
    O.getOrElse(() => 0)
  )

export const getHeight = (board: Board): number => board.cells.length

export const getCellAt =
  ({ x, y }: Vector2) =>
  (board: Board): O.Option<Cell> =>
    positionWithinBounds({ x, y })(board) ? O.some(board.cells[y][x]) : O.none

export const positionWithinBounds =
  ({ x, y }: Vector2) =>
  (board: Board): boolean =>
    pipe(
      { w: getWidth(board), h: getHeight(board) },
      ({ w, h }) => x >= 0 && x < w && y >= 0 && y < h
    )

export const generateBoard = ({
  width,
  height,
  mineCount,
}: BoardParams): BoardResult =>
  E.fromPredicate(
    () => width * height > mineCount,
    () => `Cannot fit ${mineCount} mines in this board!`
  )({
    cells: pipe(
      A.replicate(height, null),
      A.map(() => pipe(A.replicate(width, null), A.map(defaultCell)))
    ),
    mineCount,
    initialized: false,
  })

export const placeMines =
  (positions: Vector2[]) =>
  (board: Board): Board =>
    produce(board, (board) => {
      for (const { x, y } of positions) {
        if (positionWithinBounds({ x, y })(board)) {
          board.cells[y][x].hasMine = true
        }
      }
    })

export const initializeBoard =
  (excludePosition: Vector2) =>
  (board: Board): Board => {
    const width = getWidth(board)
    const height = getHeight(board)

    const positions: Vector2[] = []

    while (positions.length < board.mineCount) {
      const { x: xN, y: yN } = randomPosition(width, height)

      const shouldAdd =
        positions.every(({ x, y }) => !(xN === x && yN === y)) &&
        !(excludePosition.x === xN && excludePosition.y === yN)
      if (shouldAdd) positions.push({ x: xN, y: yN })
    }

    return {
      ...placeMines(positions)(board),
      initialized: true,
    }
  }

export const markCellAt =
  (position: Vector2) =>
  (board: Board): Board =>
    pipe(
      getCellAt(position)(board),
      O.map<Cell, Board>((cell) => {
        const { x, y } = position

        return produce(board, (board) => {
          const newCell = markCell(cell)
          board.cells[y][x] = newCell
        })
      }),
      O.getOrElse(() => board)
    )

const neighborOffsets = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
]

export const getNeighborPositions =
  ({ x, y }: Vector2) =>
  (board: Board): Vector2[] => {
    if (!positionWithinBounds({ x, y })(board)) return []
    return pipe(
      neighborOffsets,
      A.map(([xOff, yOff]) => ({ x: x + xOff, y: y + yOff })),
      A.filter((nPos) => positionWithinBounds(nPos)(board))
    )
  }

export const getNeighboringCells =
  (position: Vector2) =>
  (board: Board): Cell[] =>
    pipe(
      getNeighborPositions(position)(board),
      A.filterMap((nPos) => getCellAt(nPos)(board))
    )

export const revealCellAt =
  (position: Vector2) =>
  (board: Board): Board => {
    const countNeighboringMines = (pos: Vector2) =>
      flow(
        getNeighboringCells(pos),
        A.filter((cell) => cell.hasMine),
        (cells) => cells.length
      )

    const countNeighboringFlags = (pos: Vector2) =>
      flow(
        getNeighboringCells(pos),
        A.filter(
          (cell) => cell.state === 'hidden' && cell.markedAs === 'flagged'
        ),
        (cells) => cells.length
      )

    return pipe(
      getCellAt(position)(board),

      // Don't do anything if cell satisfies following
      O.filter(
        (cell) => !(cell.state === 'hidden' && cell.markedAs !== 'none')
      ),

      // Initialize board before reveal
      O.map(() =>
        board.initialized ? board : initializeBoard(position)(board)
      ),

      // Reveal cell at position, propagation using BFS
      O.map((board) =>
        produce(board, (board) => {
          const queue = [position]

          while (queue.length > 0) {
            const currentPosition = queue.pop() ?? { x: -1, y: -1 }

            const neighborPositions =
              getNeighborPositions(currentPosition)(board)
            const neighboringMineCount =
              countNeighboringMines(currentPosition)(board)
            const neighboringFlagCount =
              countNeighboringFlags(currentPosition)(board)

            // Reveal cell at current position
            const { x, y } = currentPosition
            board.cells[y][x] = revealCell(neighboringMineCount)(
              board.cells[y][x]
            )

            // Then propagate cell reveal outwards if flag and mine counts match
            if (neighboringFlagCount === neighboringMineCount) {
              const hiddenCellPositions = pipe(
                neighborPositions,
                A.filter((nPos) =>
                  pipe(
                    getCellAt(nPos)(board),
                    O.filter(
                      (cell) =>
                        cell.state === 'hidden' && cell.markedAs === 'none'
                    ),
                    O.isSome
                  )
                )
              )

              for (const position of hiddenCellPositions) {
                queue.push(position)
              }
            }
          }
        })
      ),
      O.getOrElse(() => board)
    )
  }

const directNeighborOffsets = [
  [0, -1],
  [0, 1],
  [-1, 0],
  [1, 0],
]

export const getAllPositions = (board: Board): Vector2[][] =>
  pipe(
    board.cells,
    A.mapWithIndex((y, row) => A.mapWithIndex((x) => ({ x, y }))(row))
  )

export const getDirectNeighborStates =
  ({ x, y }: Vector2) =>
  (board: Board): NeighboringStates =>
    pipe(
      directNeighborOffsets,
      A.map(([xOff, yOff]) =>
        pipe(
          { x: x + xOff, y: y + yOff },
          (pos) => getCellAt(pos)(board),
          O.map((cell) => cell.state)
        )
      ),
      (arr) => ({
        top: arr[0],
        bottom: arr[1],
        left: arr[2],
        right: arr[3],
      })
    )

export const updateCellRoundedCorners = (board: Board) =>
  pipe(
    getAllPositions(board),
    A.map(
      A.map(
        flow(
          (position: Vector2): [Vector2, O.Option<HiddenCell>] => [
            position,
            pipe(getCellAt(position)(board), O.filter(isHidden)),
          ],
          ([position, cellOption]) =>
            pipe(getDirectNeighborStates(position)(board), (nStates) =>
              pipe(cellOption, O.map(calculateRoundedCorners(nStates)))
            )
        )
      )
    ),
    (updatedCellOptions) =>
      produce(board, (board) => {
        for (let y = 0; y < board.cells.length; y++) {
          for (let x = 0; x < board.cells[y].length; x++) {
            const updatedCellOption = updatedCellOptions[y][x]
            if (O.isSome(updatedCellOption)) {
              board.cells[y][x] = updatedCellOption.value
            }
          }
        }
      })
  )
