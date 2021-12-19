import "../styles/Board.css";

import { Cell } from "./Cell";
import { useEffect, useState } from "react";
import { BoardLogic, IBoard } from "../utils/BoardLogic"

interface IBoardProps extends IBoard {
  onUpdate: (board: BoardLogic) => void
}

const Board = (props: IBoardProps) => {
  const {width, height, numMines} = props
  
  const [board, setBoard] = useState(() => 
  new BoardLogic(width, height, numMines))
  
  props.onUpdate(board)
  
  useEffect(() => {
    setBoard(new BoardLogic(width, height, numMines))
  }, [width, height, numMines])

  const rows = []
  for (let y = 0; y < board.height; y++) {
    const cells = []
    for (let x = 0; x < board.width; x++) {
      cells.push(<Cell {...board.at([x, y])}
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