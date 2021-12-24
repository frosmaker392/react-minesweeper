import { ICell } from '../utils/BoardLogic'

import { HiFlag as FlagIcon } from 'react-icons/hi'
import { GiAbstract016 as MineIcon } from 'react-icons/gi'

interface ICellProps extends ICell {
  fontSize: number
  onClick: () => void
  onRightClick: () => void
}

export const Cell = (props: ICellProps) => {
  const {state, hasMine, neighboringMines: nMines} = props
  const {fontSize, onClick, onRightClick} = props

  let inner: string | JSX.Element = ""
  switch (state) {
    case "revealed":
      inner = hasMine ? <MineIcon /> 
        : `${nMines > 0 ? nMines : ""}`
      break;
    case "flagged":
      inner = <FlagIcon />
      break;
    case "unknown":
      inner = "?"
      break;
    default:
      break;
  }

  const className = state !== "hidden" ? state : ""

  return (
    <div 
      onClick={onClick}
      onContextMenu={(e) => {
        e.preventDefault()
        onRightClick()
      }}
      style={{fontSize}}
      className= {"board cell " + className}>
        {inner}
    </div>
  )
};