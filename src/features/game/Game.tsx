import React, { type FC } from 'react'
import { useAppSelector } from '../../app/hooks'
import Board from '../board/Board'
import GameMenu from '../menu/GameMenu'
import { determineGameState } from './gameFunctions'

const Game: FC = () => {
  const board = useAppSelector((state) => state.board)
  const isLost = determineGameState(board) === 'lost'

  return (
    <div className="game">
      <section className="board-container">
        <Board />
        <GameMenu />
        {isLost && <div className="board-overlay" />}
      </section>
    </div>
  )
}

export default Game
