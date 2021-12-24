import { BoardLogic, IBoard } from '../utils/BoardLogic'

import { useState } from 'react'
import Board from './Board'
import Stopwatch from './Stopwatch'

import { BiTimeFive as TimeIcon } from 'react-icons/bi'
import { GiAbstract016 as MineIcon } from 'react-icons/gi'

import "../styles/Game.css"
import GameMenu from './GameMenu'

type GameState = "won" | "in_progress" | "lost"

const initParams: IBoard = {
  width: 10,
  height: 10,
  numMines: 10
}

const Game = () => {
  const [boardProps, setBoardProps] = useState(initParams)

  const [seconds, setSeconds] = useState(0)
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
        <TimeIcon className="game stopwatch icon" />
        <Stopwatch 
          className="game stopwatch value"
          paused={paused}
          seconds={seconds}
          onUpdateSeconds={(delta) => setSeconds(seconds + delta)}
          />
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
        <MineIcon className="game flag-count icon" />
        <span className="game flag-count value">
          {flagCount} / {boardProps.numMines}
        </span>
      </div>
    </section>
    <section className="game board">
      <Board onUpdate={onUpdate} {...boardProps}/>
      { 
        paused && gameState === "in_progress" && 
        <GameMenu 
          boardParams={boardProps}
          onResume={() => setPaused(false)}
          onNewGame={(boardParams) => {
            setBoardProps(boardParams)
            setSeconds(0)
            setPaused(false)
          }}
        /> 
      }
    </section>
  </div> )
}

export default Game