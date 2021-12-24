import { IBoard, BoardState } from '../utils/BoardLogic'

import { useEffect, useState } from 'react'
import Board from './Board'
import Stopwatch from './Stopwatch'

import { BiTimeFive as TimeIcon } from 'react-icons/bi'
import { GiAbstract016 as MineIcon } from 'react-icons/gi'

import "../styles/Game.css"
import GameMenu from './GameMenu'

const initParams: IBoard = {
  width: 10,
  height: 10,
  numMines: 10
}

const Game = () => {
  const [boardParams, setBoardParams] = useState(initParams)

  const [seconds, setSeconds] = useState(0)
  const [paused, setPaused] = useState(false)
  const [flagCount, setFlagCount] = useState(0)
  const [gameState, setGameState] = useState("in-progress" as BoardState)

  useEffect(() => {
    if (gameState !== "in-progress") setPaused(true)
  }, [gameState])

  const onPauseButton = () => {
    setPaused(!paused)
  }

  const onBoardUpdate = (state: BoardState, flagCnt: number) => {
    setGameState(state)
    setFlagCount(flagCnt)
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
        gameState === "in-progress" ?
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
          {flagCount} / {boardParams.numMines}
        </span>
      </div>
    </section>
    <section className="game board">
      <Board onUpdate={onBoardUpdate} {...boardParams}/>
      { 
        paused && gameState === "in-progress" && 
        <GameMenu 
          boardParams={boardParams}
          onResume={() => setPaused(false)}
          onNewGame={(boardParams) => {
            setBoardParams(boardParams)
            setSeconds(0)
            setPaused(false)
          }}
        /> 
      }
    </section>
  </div> )
}

export default Game