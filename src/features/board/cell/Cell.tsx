import React, { type MouseEventHandler, type FC } from 'react'
import * as A from 'fp-ts/lib/Array'
import { pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'
import { Monoid as StrMonoid } from 'fp-ts/lib/string'
import type { Cell as TCell, Corner, MarkType } from './types'
import { isHidden, isRevealed } from './cellFunctions'

import { ReactComponent as FlagIcon } from '../../../icons/Flag.svg'
import { ReactComponent as MineIcon } from '../../../icons/Mine.svg'

import classes from './Cell.module.css'

interface LowerProps {
  neighboringMineCount?: number
  showMine: boolean
}

interface UpperProps {
  markedAs: MarkType
  showMine: boolean
  roundedCorners: Corner[]
}

interface CellProps {
  cell: TCell
  revealMine: boolean
  fontSize: number
  onLeftClick: () => void
  onRightClick: () => void
}

type UpperIconsKey = MarkType | 'mine'

const upperIcons: Record<UpperIconsKey, JSX.Element> = {
  none: <></>,
  flagged: <FlagIcon data-testid="flag-icon" />,
  unknown: <div data-testid="question-mark">?</div>,
  mine: <MineIcon className={classes.mine} data-testid="mine-icon" />,
}

const Lower: FC<LowerProps> = ({ neighboringMineCount, showMine }) => {
  const display = showMine
    ? upperIcons.mine
    : pipe(
        neighboringMineCount,
        O.fromNullable,
        O.map(Math.floor),
        O.filter((num) => num !== 0),
        O.map((num) => num.toString()),
        O.getOrElse(() => '')
      )

  return (
    <div className={classes.cellLower} data-testid="cell-lower">
      {display}
    </div>
  )
}

const Upper: FC<UpperProps> = ({ markedAs, showMine, roundedCorners }) => {
  const key = showMine ? 'mine' : markedAs
  const cornerClasses = pipe(
    roundedCorners,
    A.map((corner) => classes[corner]),
    A.intercalate(StrMonoid)(' ')
  )

  return (
    <>
      <div className={`${classes.shadow} ${cornerClasses}`} />
      <div
        className={`${classes.cellUpper} ${cornerClasses}`}
        data-testid="cell-upper"
      >
        {upperIcons[key]}
      </div>
    </>
  )
}

const Cell: FC<CellProps> = ({
  cell,
  revealMine,
  fontSize,
  onLeftClick,
  onRightClick,
}) => {
  const neighboringMineCount = isRevealed(cell)
    ? cell.neighboringMines
    : undefined

  const showUpper = isHidden(cell)
  const showMineLower = isRevealed(cell) && cell.hasMine && revealMine
  const showMineUpper = isHidden(cell) && cell.hasMine && revealMine

  const handleRightClick: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
    onRightClick()
  }

  return (
    <div
      className={`${classes.cell} unselectable`}
      style={{ fontSize }}
      onClick={onLeftClick}
      onContextMenu={handleRightClick}
      data-testid="cell-container"
    >
      <Lower
        neighboringMineCount={neighboringMineCount}
        showMine={showMineLower}
      />
      {showUpper && <Upper {...cell} showMine={showMineUpper} />}
    </div>
  )
}

export default Cell
