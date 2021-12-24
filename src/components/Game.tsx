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

  const [gameState, setGameState] = useState("in-progress" as BoardState)
  const [flagCount, setFlagCount] = useState(0)
  const [seconds, setSeconds] = useState(0)
  
  const [paused, setPaused] = useState(false)
  const [resetCounter, setResetCounter] = useState(0)

  useEffect(() => {
    if (gameState !== "in-progress") setPaused(true)
  }, [gameState])

  const onPauseButton = () => setPaused(!paused)

  // Updates gameState and flagCnt
  const updateGameState = (state: BoardState, flagCnt: number) => {
    setGameState(state)
    setFlagCount(flagCnt)
  }

  // Resets board according to boardParams
  const resetBoard = (boardParams: IBoard) => {
    setResetCounter(resetCounter + 1)
    setBoardParams(boardParams)
    setSeconds(0)
    setPaused(false)
  }

  return (
  <div className="game container">
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
        !paused && <button onClick={onPauseButton}>Pause</button>
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
      <Board 
        resetCounter={resetCounter}
        onUpdate={updateGameState} 
        {...boardParams}/>
      { 
        paused && gameState === "in-progress" && 
        <GameMenu 
          boardParams={boardParams}
          onResume={() => setPaused(false)}
          onNewGame={resetBoard}
        /> 
      }
    </section>
  </div> )
}

export default Game