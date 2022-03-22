import { IBoard } from "../../utils/BoardLogic"
import { getDifficulty } from "../../utils/boardPresets"
import capitalizeFirstChar from  "../../utils/capitalizeFirstChar";

import "../../styles/ui/GameFooter.css"

interface IGameFooterProps {
  boardParams: IBoard
}

const GameFooter = ({ boardParams }: IGameFooterProps) => {
  const {width, height, numMines} = boardParams;

  return (
    <footer className="gameFooter">
      <p className="description">
        { capitalizeFirstChar(getDifficulty(boardParams)) }
        : ({width}x{height} cells, {numMines} mines)
      </p>
    </footer>
  )
}

export default GameFooter;