import React, { type FC } from 'react'
import Board from '../board/Board'
import GameMenu from '../menu/GameMenu'

import classes from './Game.module.css'
import withBoardState from './withBoardState'
import { withGameHeaderState } from './header/withGameHeaderState'
import GameHeader from './header/GameHeader'
import withGameFooterState from './footer/withGameFooterState'
import GameFooter from './footer/GameFooter'
import useGameReset from '../../hooks/useGameReset'
import useGameToggleMenu from '../../hooks/useGameToggleMenu'
import useGameUpdate from '../../hooks/useGameUpdate'

const BoardWithState = withBoardState(Board)
const GameHeaderWithState = withGameHeaderState(GameHeader)
const GameFooterWithState = withGameFooterState(GameFooter)

const Game: FC = () => {
  const onToggleMenu = useGameToggleMenu()
  const onUpdate = useGameUpdate()
  const onReset = useGameReset()

  return (
    <div className={classes.game}>
      <GameHeaderWithState onClickMenuButton={onToggleMenu} />

      <section className={classes.boardContainer}>
        <BoardWithState onUpdate={onUpdate} />
        <GameMenu onReset={onReset} />
      </section>

      <GameFooterWithState />
    </div>
  )
}

export default Game
