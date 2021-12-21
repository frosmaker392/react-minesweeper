import { ICell } from '../utils/BoardLogic'

import { HiFlag } from 'react-icons/hi'
import { GiAbstract016 } from 'react-icons/gi'

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
      inner = hasMine ? <GiAbstract016 /> 
        : `${nMines > 0 ? nMines : ""}`
      break;
    case "flagged":
      inner = <HiFlag />
      break;
    case "unknown":
      inner = "?"
      break;
    default:
      break;
  }

  return <div 
    onClick={onClick}
    onContextMenu={(e) => {
      e.preventDefault()
      onRightClick()
    }}
    style={{fontSize}}
    className= {"board cell" + (state === "revealed" ? " revealed" : "")}>
      {inner}
  </div>
};