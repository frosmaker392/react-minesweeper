import { useState } from "react"
import { IBoard } from "../../utils/BoardLogic"

import PauseView from "./PauseView"
import NewGameView from "./NewGameView"
import HowToPlayView from "./HowToPlayView"

type MenuView = "pause" | "newGame" | "howToPlay"

interface IGameMenuProps {
  boardParams: IBoard
  onNewGame: (boardParams: IBoard) => void
}

const GameMenu = ({boardParams, onNewGame}: IGameMenuProps) => {
  const [currentView, setCurrentView] = useState("pause" as MenuView)

  const views: Record<MenuView, JSX.Element> = {
    pause     : <PauseView
                  onRestart={() => onNewGame(boardParams)}
                  onNewGame={() => setCurrentView("newGame")}
                  onHowToPlay={() => setCurrentView("howToPlay")}
                  />,
    newGame   : <NewGameView 
                  boardParams={boardParams}
                  onSubmit={onNewGame}
                  onReturn={() => setCurrentView("pause")}
                  />,
    howToPlay : <HowToPlayView 
                  onReturn={() => setCurrentView("pause")}/>
  }

  const currentViewElement = views[currentView]

  return (
    <div className="boardOverlay menu">
      <div className="menuView-container">
        { currentViewElement }
      </div>
    </div>
  )
}

export default GameMenu