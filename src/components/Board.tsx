import { Cell } from "./Cell";
import "../styles/Board.css";

interface BoardProps {
  height: number,
  width: number
}

const Board = ({ height, width }: BoardProps) => {
  const rows = []
  
  for (let y = 0; y < height; y++) {
    const cells = []

    for (let x = 0; x < width; x++) {
      cells.push(<Cell />)
    }
    rows.push(<div className="board row">{ cells }</div>);
  }

  return <div className="board">{rows}</div>
}

export default Board;