import React, { type FC } from 'react'
import { useAppSelector } from '../../app/hooks'
import Board from '../board/Board'
import GameMenu from '../menu/GameMenu'
import { determineGameState } from './gameFunctions'

import classes from './Game.module.css'
import DisableBoardInput from '../menu/DisableBoardInput'

const Game: FC = () => {
  const board = useAppSelector((state) => state.board)
  const isLost = determineGameState(board) === 'lost'

  return (
    <div className={classes.game}>
      <section className={classes.boardContainer}>
        <Board />
        <GameMenu />
        {isLost && <DisableBoardInput />}
      </section>
    </div>
  )
}

export default Game
