import type { Cell, HiddenCell, MarkType } from './types'

const nextCellMarking: Record<MarkType, MarkType> = {
  none: 'flagged',
  flagged: 'unknown',
  unknown: 'none'
}

export const defaultCell = (): HiddenCell => ({
  state: 'hidden',
  hasMine: false,
  markedAs: 'none'
})

export const cycleCellMarking = (cell: Cell): Cell => {
  if (cell.state === 'revealed') return cell

  return {
    ...cell,
    markedAs: nextCellMarking[cell.markedAs]
  }
}
