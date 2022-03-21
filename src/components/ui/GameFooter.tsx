import { IBoard } from "../../utils/BoardLogic"
import { getDifficulty } from "../../utils/boardPresets"
import capitalizeFirstChar from  "../../utils/capitalizeFirstChar";

import { BiPalette as ThemeIcon } from 'react-icons/bi'

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
      <button className="theme" value="theme">
        <ThemeIcon />
      </button>
    </footer>
  )
}

export default GameFooter;