import * as A from 'fp-ts/lib/Array'
import { flow, pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'
import type { Cell, CellState, Corner, HiddenCell, MarkType, NeighboringStates, RevealedCell } from './types'

const nextCellMarking: Record<MarkType, MarkType> = {
  none: 'flagged',
  flagged: 'unknown',
  unknown: 'none'
}

export const isHidden = (cell: Cell): cell is HiddenCell => cell.state === 'hidden'
export const isRevealed = (cell: Cell): cell is RevealedCell => cell.state === 'revealed'

export const defaultCell = (): HiddenCell => ({
  state: 'hidden',
  hasMine: false,
  markedAs: 'none',
  roundedCorners: []
})

export const markCell = (cell: Cell): Cell => {
  if (cell.state === 'revealed') return cell

  return {
    ...cell,
    markedAs: nextCellMarking[cell.markedAs]
  }
}

export const revealCell = (neighboringMines: number) => (cell: Cell): RevealedCell => {
  return {
    state: 'revealed',
    hasMine: cell.hasMine,
    neighboringMines
  }
}

const shouldRoundCorner = ([a, b]: [O.Option<CellState>, O.Option<CellState>]): boolean =>
  pipe(
    [a, b],
    A.map(
      flow(
        O.map(state => state === 'revealed'),
        O.getOrElse(() => false)
      )
    ),
    A.reduce(true, (a, b) => a && b)
  )

const orderedCorners: Corner[] = [
  'topLeft',
  'topRight',
  'bottomLeft',
  'bottomRight'
]

export const calculateRoundedCorners =
  ({ top, bottom, left, right }: NeighboringStates) => (cell: HiddenCell): HiddenCell =>
    pipe(
      [
        shouldRoundCorner([top, left]),
        shouldRoundCorner([top, right]),
        shouldRoundCorner([bottom, left]),
        shouldRoundCorner([bottom, right])
      ],
      A.zip(orderedCorners),
      A.filter(([include]) => include),
      A.map(([, corner]) => corner),
      roundedCorners => ({
        ...cell,
        roundedCorners
      })
    )
