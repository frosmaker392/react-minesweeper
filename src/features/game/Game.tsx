import React, { type FC } from 'react'
import Board from '../board/Board'
import GameMenu from '../menu/GameMenu'

import classes from './Game.module.css'
import DisableBoardInput from '../menu/DisableBoardInput'
import withBoardState from './withBoardState'
import { useAppSelector } from '../../app/hooks'
import { withGameHeaderState } from './withGameHeaderState'
import GameHeader from './GameHeader'

const BoardWithState = withBoardState(Board)
const GameHeaderWithState = withGameHeaderState(GameHeader)

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
    </div>
  )
}

export default Game
