import { ICell } from '../utils/BoardLogic'

interface ICellProps extends ICell {
  onClick: () => void
  onRightClick: () => void
}

export const Cell = (props: ICellProps) => {
  const nMines = props.neighbouringMines;
  let inner = ""
  switch (props.state) {
    case "revealed":
      if (props.hasMine) inner = "X"
      else inner = `${nMines > 0 ? nMines : ""}`
      break;
    case "flagged":
      inner = "F"
      break;
    case "unknown":
      inner = "?"
      break;
    default:
      break;
  }

  return <button 
    onClick={props.onClick}
    onContextMenu={(e) => {
      e.preventDefault()
      props.onRightClick()
    }}
    className="board cell">{inner}</button>
};