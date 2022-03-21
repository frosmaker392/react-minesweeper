import { ICell } from '../utils/BoardLogic'

import { HiFlag as FlagIcon } from 'react-icons/hi'
import { GiAbstract016 as MineIcon } from 'react-icons/gi'

import "../styles/Cell.css"

interface ICellProps {
  cellParams: ICell
  revealMine: boolean
  fontSize: number
  onClick: () => void
  onRightClick: () => void
}

export const Cell = (props: ICellProps) => {
  const {state, hasMine, neighboringMines: nMines} = props.cellParams
  const {revealMine, fontSize, onClick, onRightClick} = props

  let inner: string | JSX.Element = ""
  let className: string = state
  switch (state) {
    case "revealed":
      if (hasMine) {
        inner = <MineIcon />
        className += " with-mine"
      }
      else inner = `${nMines > 0 ? nMines : ""}`
      break
    case "flagged":
      inner = <FlagIcon />
      break
    case "unknown":
      inner = "?"
      break
    default:
      if (revealMine && hasMine) {
        inner = <MineIcon />
        className = "with-mine"
      }
      break
  }

  return (
    <div 
      onClick={onClick}
      onContextMenu={(e) => {
        e.preventDefault()
        onRightClick()
      }}
      style={{fontSize}}
      className= {"boardCell unselectable " + className}>
        {inner}
    </div>
  )
};