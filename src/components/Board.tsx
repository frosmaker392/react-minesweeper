import "../styles/Board.css";

import { Cell } from "./Cell";
import { useState } from "react";
import { BoardLogic } from "../utils/BoardLogic"

interface BoardProps {
  height: number,
  width: number
}

const Board = ({ height, width }: BoardProps) => {
  const [board, setBoard] = useState(() => new BoardLogic(width, height, 5))

  const rows = []
  for (let y = 0; y < height; y++) {
    const cells = []

    for (let x = 0; x < width; x++) {
      cells.push(<Cell {...board.cells[y][x]}
        key={x}
        onClick={() => setBoard(board.reveal([x, y]))}
        onRightClick={() => setBoard(board.mark([x, y]))}
        />)
    }
    rows.push(<div key={y} className="board row">{ cells }</div>);
  }

  return <div className="board">{rows}</div>
}

export default Board;