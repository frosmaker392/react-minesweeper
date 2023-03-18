import React from 'react'
import { type CellState, type ICell } from '../utils/BoardLogic'

import { ReactComponent as FlagIcon } from '../icons/Flag.svg'
import { ReactComponent as MineIcon } from '../icons/Mine.svg'

import '../styles/Cell.css'
import enumKeys from '../utils/enumKeys'

enum Corner {
  TopLeft = 1 << 0,
  TopRight = 1 << 1,
  BottomLeft = 1 << 2,
  BottomRight = 1 << 3
}

const cornerClassNames: Record<Corner, string> = {
  [Corner.TopLeft]: 'top-left',
  [Corner.TopRight]: 'top-right',
  [Corner.BottomLeft]: 'bottom-left',
  [Corner.BottomRight]: 'bottom-right'
}

interface ILowerProps {
  cellParams: Pick<ICell, 'state' | 'hasMine' | 'neighboringMines'>
  className: string
}

interface IUpperProps {
  cellParams: Pick<ICell, 'state' | 'hasMine'>
  revealMine: boolean
  className: string
}

interface ICellProps {
  cellParams: ICell
  revealMine: boolean
  fontSize: number
  roundCorners: Corner
  onClick: () => void
  onRightClick: () => void
}

const Lower = ({ cellParams, className }: ILowerProps): JSX.Element => {
  const { state, hasMine, neighboringMines: nMines } =
    cellParams

  return state === 'revealed'
    ? (hasMine
        ? <MineIcon className={className + ' with-mine'} />
        : <div className={className}>{nMines > 0 ? nMines : ''}</div>)
    : <div className={className} />
}

const Upper = ({ cellParams, revealMine, className }: IUpperProps): JSX.Element => {
  const { state, hasMine } = cellParams

  const upperElements: Record<CellState, JSX.Element> = {
    hidden: (revealMine && hasMine
      ? <MineIcon className={className + ' with-mine'} />
      : <div className={className} />),
    revealed: <></>,
    flagged: <FlagIcon className={className} />,
    unknown: <div className={className} >?</div>
  }

  return upperElements[state]
}

const Cell: React.FC<ICellProps> =
props => {
  const { state } = props.cellParams
  const { revealMine, fontSize, roundCorners, onClick, onRightClick } =
    props

  const cornerClasses =
    enumKeys(Corner)
      .map(k => Corner[k])
      .filter(dir => (roundCorners & dir) === dir)
      .map(dir => cornerClassNames[dir])
      .join(' ')

  return (
    <div
      onClick={onClick}
      onContextMenu={(e) => {
        e.preventDefault()
        onRightClick()
      }}
      style={{ fontSize }}
      className={'board-cell unselectable ' + state}>
        <Lower cellParams={props.cellParams} className='lower' />
        {state !== 'revealed' &&
          <div className={'shadow ' + cornerClasses} />}
        <Upper cellParams={props.cellParams} revealMine={revealMine}
          className={'upper ' + cornerClasses} />
    </div>
  )
}

export { Cell, Corner }
