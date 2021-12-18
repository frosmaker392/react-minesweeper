type CellState = "hidden" | "revealed" | "flagged" | "unknown"

interface ICellProps {
  state: CellState
  hasMine: boolean
  neighbouringMines: number
  onClick: () => void
  onRightClick: () => void
}

export const Cell = (props: ICellProps) => {
  let inner = ""
  switch (props.state) {
    case "revealed":
      if (props.hasMine) inner = "X"
      else inner = props.neighbouringMines.toString()
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