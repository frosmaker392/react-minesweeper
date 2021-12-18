import { Cell } from "./Cell";
import "../styles/Board.css";
import { useState } from "react";
import { Board as BoardL } from "../utils/BoardLogic"

interface BoardProps {
  height: number,
  width: number
}

const Board = ({ height, width }: BoardProps) => {
  const [board, setBoard] = useState(() => new BoardL(width, height, 5))

  const rows = []
  for (let y = 0; y < height; y++) {
    const cells = []

    for (let x = 0; x < width; x++) {
      cells.push(<Cell {...board.cells[y][x]}
        key={x}
        onClick={() => setBoard(BoardL.reveal(board, [x, y]))}
        onRightClick={() => setBoard(BoardL.mark(board, [x, y]))}
        />)
    }
    rows.push(<div key={y} className="board row">{ cells }</div>);
  }

  return <div className="board">{rows}</div>
}

export default Board;