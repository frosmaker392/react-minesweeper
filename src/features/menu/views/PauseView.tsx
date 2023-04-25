import React, { type FC } from 'react'
import Button from '../../../components/atoms/Button'

import classes from './MenuView.module.css'

interface Props {
  onRestart: () => void
  onNewGame: () => void
  onHowToPlay: () => void
}

const PauseView: FC<Props> = ({ onRestart, onNewGame, onHowToPlay }) => (
  <div className={`${classes.menuView} ${classes.pause}`}>
    <Button onClick={onRestart}>Restart</Button>
    <Button onClick={onNewGame}>New Game</Button>
    <Button onClick={onHowToPlay}>How to Play</Button>
  </div>
)

export default PauseView
