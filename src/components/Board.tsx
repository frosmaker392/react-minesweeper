import "../styles/Board.css";

import { Cell } from "./Cell";
import { useRef, useEffect, useState } from "react";
import { BoardLogic, IBoard, BoardState } from "../utils/BoardLogic"

interface IBoardProps extends IBoard {
  resetCounter: number
  onUpdate: (state: BoardState, flagCount: number) => void
}

const Board = (props: IBoardProps) => {
  const {width, height, numMines} = props
  const {resetCounter, onUpdate} = props
  
  const ref = useRef<HTMLDivElement>(null)

  const [elemWidth, setElemWidth] = useState(0)
  const [board, setBoard] = useState(() => new BoardLogic(width, height, numMines))

  // Creates a routine which updates elemWidth of the ref
  // every 100 ms
  useEffect(() => {
    const resizeRoutine = setInterval(() => {
        if (ref.current)
          setElemWidth(ref.current.offsetWidth)
      }, 100)
    return () => clearInterval(resizeRoutine)
  }, [])

  // Run onUpdate on each board change, passing board state
  useEffect(() => onUpdate(board.state(), board.flagCount()), 
    [board, onUpdate])

  // Reset board if any of the params change
  useEffect(() => setBoard(new BoardLogic(width, height, numMines))
    , [resetCounter, width, height, numMines])

  const rows = []
  for (let y = 0; y < board.height; y++) {
    const cells = []
    for (let x = 0; x < board.width; x++) {
      cells.push(
        <Cell {...board.at([x, y])}
          key={x}
          fontSize={elemWidth / board.width * 0.5}
          onClick={() => setBoard(board.reveal([x, y]))}
          onRightClick={() => setBoard(board.mark([x, y]))}
        />)
    }
    rows.push(<div key={y} className="board row">{ cells }</div>);
  }

  return <div ref={ref} className="board container">{ rows }</div>
}

export default Board;