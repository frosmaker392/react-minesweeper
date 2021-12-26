import { IBoard, BoardState } from '../utils/BoardLogic'

import { useCallback, useEffect, useState } from 'react'
import Board from './Board'
import GameMenu from './menu/GameMenu'
import Stopwatch from './utils/Stopwatch'

import { BiTimeFive as TimeIcon } from 'react-icons/bi'
import { GiAbstract016 as MineIcon } from 'react-icons/gi'

import "../styles/Game.css"
import "../styles/GameMenu.css"

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
  const updateGameState = useCallback(
    (state: BoardState, flagCnt: number) => {
      setGameState(state)
      setFlagCount(flagCnt)
    }, [])
  

  // Resets board according to boardParams
  const resetBoard = useCallback(
    (boardParams: IBoard) => {
      setResetCounter(resetCounter + 1)
      setBoardParams(boardParams)
      setSeconds(0)
      setPaused(false)
    }, [resetCounter])

  return (
  <div className="game">
    <section className="game__header">
      <div className="header__elem">
        <TimeIcon className="icon" />
        <Stopwatch 
          className="value"
          paused={paused}
          seconds={seconds}
          onUpdateSeconds={(delta) => setSeconds(seconds + delta)}
          />
      </div>

      {
        (gameState === "in-progress" && !paused) ?
        <button className="header__elem button focusable" onClick={onPauseButton}>
          Pause
        </button>
        :
        <p className="header__elem status">
        {
          gameState === "in-progress" ?
          paused && "Paused" :
          `You ${gameState === "won" ? "won" : "lost"}`
        }
        </p>
      }

      <div className="header__elem">
        <MineIcon className="icon" />
        <span className="value">
          {flagCount} / {boardParams.numMines}
        </span>
      </div>
    </section>
    <section className="game__board">
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