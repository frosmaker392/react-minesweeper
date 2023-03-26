import React, { type MouseEventHandler, type FC } from 'react'
import * as A from 'fp-ts/lib/Array'
import { flow, pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'
import { Monoid as StrMonoid } from 'fp-ts/lib/string'
import type { Cell as TCell, Corner, MarkType } from './types'
import { isHidden, isRevealed } from './cellFunctions'

import { ReactComponent as FlagIcon } from '../../icons/Flag.svg'
import { ReactComponent as MineIcon } from '../../icons/Mine.svg'

import classes from './Cell.module.css'

interface LowerProps {
  neighboringMineCount: O.Option<number>
}

interface UpperProps {
  markedAs: MarkType
  revealMine: boolean
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
  flagged: <FlagIcon />,
  unknown: <>?</>,
  mine: <MineIcon className="mine" />,
}

const Lower: FC<LowerProps> = ({ neighboringMineCount }) => {
  const display = pipe(
    neighboringMineCount,
    O.map(Math.floor),
    O.filter((num) => num !== 0),
    O.map((num) => num.toString()),
    O.getOrElse(() => '')
  )

  return <div>{display}</div>
}

const Upper: FC<UpperProps> = ({ markedAs, revealMine, roundedCorners }) => {
  const key = revealMine ? 'mine' : markedAs
  const cornerClasses = pipe(
    roundedCorners,
    A.map((corner) => classes[corner]),
    A.intercalate(StrMonoid)(' ')
  )

  return (
    <>
      <div data-testid="" className={`${classes.shadow} ${cornerClasses}`} />
      <div data-testid="" className={`${classes.cellUpper} ${cornerClasses}`}>
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
  const lower = pipe(
    O.some(cell),
    O.filter(isRevealed),
    O.map((cell) => cell.neighboringMines),
    (nMines) => <Lower neighboringMineCount={nMines} />
  )

  const upper = pipe(
    O.some(cell),
    O.filter(isHidden),
    O.map(
      flow(
        ({ markedAs, roundedCorners, hasMine }) =>
          ({
            markedAs,
            roundedCorners,
            revealMine: hasMine && revealMine,
          } satisfies UpperProps),
        Upper
      )
    ),
    O.getOrElse<JSX.Element | null>(() => null)
  )

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
    >
      {lower}
      {upper}
    </div>
  )
}

export default Cell
