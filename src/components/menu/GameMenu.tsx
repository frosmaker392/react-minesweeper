import React, { useState } from 'react'
import { type IBoard } from '../../utils/BoardLogic'

import PauseView from './PauseView'
import NewGameView from './NewGameView'
import HowToPlayView from './HowToPlayView'

type MenuView = 'pause' | 'newGame' | 'howToPlay'

interface IGameMenuProps {
  boardParams: IBoard
  onNewGame: (boardParams: IBoard) => void
}

const GameMenu: React.FC<IGameMenuProps> = ({ boardParams, onNewGame }) => {
  const [currentView, setCurrentView] = useState('pause' as MenuView)

  const views: Record<MenuView, JSX.Element> = {
    pause: (
      <PauseView
        onRestart={() => {
          onNewGame(boardParams)
        }}
        onNewGame={() => {
          setCurrentView('newGame')
        }}
        onHowToPlay={() => {
          setCurrentView('howToPlay')
        }}
      />
    ),
    newGame: (
      <NewGameView
        boardParams={boardParams}
        onSubmit={onNewGame}
        onReturn={() => {
          setCurrentView('pause')
        }}
      />
    ),
    howToPlay: (
      <HowToPlayView
        onReturn={() => {
          setCurrentView('pause')
        }}
      />
    ),
  }

  const currentViewElement = views[currentView]

  return (
    <div className="board-overlay menu">
      <div className="menu-view-container">{currentViewElement}</div>
    </div>
  )
}

export default GameMenu
