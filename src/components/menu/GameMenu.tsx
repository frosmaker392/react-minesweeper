import { useState } from "react"
import { IBoard } from "../../utils/BoardLogic"

import PauseView from "./PauseView"
import NewGameView from "./NewGameView"

interface IGameMenuProps {
  boardParams: IBoard
  onResume: () => void
  onNewGame: (boardParams: IBoard) => void
}

const GameMenu = ({boardParams, onResume, onNewGame}: IGameMenuProps) => {
  const [isPauseView, setIsPauseView] = useState(true)

  return (
    <div className="menu">
      {
        isPauseView ?
        <PauseView 
          onResume={onResume}
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
  )
}

export default GameMenu