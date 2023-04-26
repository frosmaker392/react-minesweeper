import React, { type FC } from 'react'
import Board from '../board/Board'
import GameMenu from '../menu/GameMenu'

import classes from './Game.module.css'
import DisableBoardInput from '../menu/DisableBoardInput'
import withBoardState from './withBoardState'
import { useAppSelector } from '../../app/hooks'
import { withGameHeaderState } from './header/withGameHeaderState'
import GameHeader from './header/GameHeader'
import withGameFooterState from './footer/withGameFooterState'
import GameFooter from './footer/GameFooter'

const BoardWithState = withBoardState(Board)
const GameHeaderWithState = withGameHeaderState(GameHeader)
const GameFooterWithState = withGameFooterState(GameFooter)

const Game: FC = () => {
  const boardState = useAppSelector((state) => state.game.boardState)
  const isLost = boardState === 'lost'

  return (
    <div className={classes.game}>
      <GameHeaderWithState />

      <section className={classes.boardContainer}>
        <BoardWithState />
        <GameMenu />
        {isLost && <DisableBoardInput />}
      </section>

      <GameFooterWithState />
    </div>
  )
}

export default Game
