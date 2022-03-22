import { useState } from "react"
import { IBoard } from "../../utils/BoardLogic"

import PauseView from "./PauseView"
import NewGameView from "./NewGameView"

interface IGameMenuProps {
  boardParams: IBoard
  onNewGame: (boardParams: IBoard) => void
}

const GameMenu = ({boardParams, onNewGame}: IGameMenuProps) => {
  const [isPauseView, setIsPauseView] = useState(true)

  return (
    <div className="menu">
      <div className="menuView-container">
        {
          isPauseView ?
          <PauseView
            onRestart={() => onNewGame(boardParams)}
            onNewGame={() => setIsPauseView(false)}
            />
          :
          <NewGameView 
            boardParams={boardParams}
            onSubmit={onNewGame}
            onCancel={() => setIsPauseView(true)}
            />
        }
      </div>
    </div>
  )
}

export default GameMenu