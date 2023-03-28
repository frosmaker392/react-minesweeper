import React, { type FC } from 'react'
import MenuButton from '../../../components/atoms/MenuButton'

interface Props {
  onRestart: () => void
  onNewGame: () => void
  onHowToPlay: () => void
}

const PauseView: FC<Props> = ({ onRestart, onNewGame, onHowToPlay }) => (
  <div className="menu-view pause">
    <MenuButton onClick={onRestart}>Restart</MenuButton>
    <MenuButton onClick={onNewGame}>New Game</MenuButton>
    <MenuButton onClick={onHowToPlay}>How to Play</MenuButton>
  </div>
)

export default PauseView
