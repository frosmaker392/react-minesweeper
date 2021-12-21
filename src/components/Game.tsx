import { BoardLogic, IBoard } from '../utils/BoardLogic'

import { useState } from 'react'
import Board from './Board'
import GameParams from './GameParams'
import Stopwatch from './Stopwatch'

import { BiTimeFive } from 'react-icons/bi'
import { GiAbstract016 } from 'react-icons/gi'

import "../styles/Game.css"

type GameState = "won" | "in_progress" | "lost"

const initParams: IBoard = {
  width: 10,
  height: 10,
  numMines: 10
}

const Game = () => {
  const [boardProps, setBoardProps] = useState(initParams)
  const [paused, setPaused] = useState(false)
  const [flagCount, setFlagCount] = useState(0)
  const [gameState, setGameState] = useState("in_progress" as GameState)

  const onPauseButton = () => {
    setPaused(!paused)
  }

  const onUpdate = (board: BoardLogic) => {
    let flagCnt = 0
    let hasWon = true
    let hasLost = false

    for (let y = 0; y < board.height; y++) {
      for (let x = 0; x < board.width; x++) {
        const cell = board.at([x, y])

        hasWon = hasWon && ((cell.state === "flagged" && cell.hasMine) || (cell.state === "revealed" && !cell.hasMine))
        hasLost = hasLost || (cell.state === "revealed" && cell.hasMine)
        if (cell.state === "flagged")
          flagCnt++
      }
    }

    setFlagCount(flagCnt)

    if (hasWon || hasLost) {
      hasWon && setGameState("won")
      hasLost && setGameState("lost")
      setPaused(true)
    }
  }

  return (
  <div className="game">
    <section className="game header">
      <div className="game stopwatch score">
        <BiTimeFive className="game stopwatch icon" />
        <Stopwatch className="game stopwatch value" paused={paused} />
      </div>

      {
        gameState === "in_progress" ?
        <button onClick={onPauseButton}>
          {paused ? "Unpause" : "Pause"}
        </button>
        : 
        <p>
          You {gameState}!
        </p> 
      }

      <div className="game flag-count score">
        <GiAbstract016 className="game flag-count icon" />
        <span className="game flag-count value">
          {flagCount} / {boardProps.numMines}
        </span>
      </div>
    </section>
    <Board onUpdate={onUpdate} {...boardProps}/>
    <GameParams init={initParams} setter={setBoardProps} />
  </div> )
}

export default Game