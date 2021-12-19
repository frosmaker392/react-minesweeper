import { ICell } from '../utils/BoardLogic'
import { HiFlag } from 'react-icons/hi'
import { GiAbstract016 } from 'react-icons/gi'

interface ICellProps extends ICell {
  onClick: () => void
  onRightClick: () => void
}

export const Cell = (props: ICellProps) => {
  const nMines = props.neighboringMines;
  let inner: string | JSX.Element = ""
  switch (props.state) {
    case "revealed":
      if (props.hasMine) inner = <GiAbstract016 />
      else inner = `${nMines > 0 ? nMines : ""}`
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
    onClick={props.onClick}
    onContextMenu={(e) => {
      e.preventDefault()
      props.onRightClick()
    }}
    className= {"board cell" + (props.state === "revealed" ? " revealed" : "")}>
      {inner}
  </div>
};