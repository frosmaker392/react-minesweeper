import React from 'react'
import MenuButton from './MenuButton'

interface IPauseProps {
  onRestart: () => void
  onNewGame: () => void
  onHowToPlay: () => void
}

const PauseView: React.FC<IPauseProps> = 
({ onRestart, onNewGame, onHowToPlay }) => 
  <div className='menu-view pause'>
    <MenuButton onClick={onRestart}>Restart</MenuButton>
    <MenuButton onClick={onNewGame}>New Game</MenuButton>
    <MenuButton onClick={onHowToPlay}>How to Play</MenuButton>
  </div>

export default PauseView