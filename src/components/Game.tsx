import { IBoard, BoardState } from '../utils/BoardLogic'
import { getDifficulty } from '../utils/boardPresets'
import capitalizeFirstChar from '../utils/capitalize'

import { useCallback, useEffect, useState } from 'react'
import { useStopwatch } from 'react-use-precision-timer'
import Board from './Board'
import GameMenu from './menu/GameMenu'
import Duration from './utils/Duration'

import { 
  BiPalette as ThemeIcon, 
  BiTimeFive as TimeIcon 
} from 'react-icons/bi'
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
  const [isPaused, setIsPaused] = useState(false)
  const [gameOver, setGameOver] = useState(false)

  const [seconds, setSeconds] = useState(0)
  const [flagCount, setFlagCount] = useState(0)
  const [resetCounter, setResetCounter] = useState(0)

  const stopwatch = useStopwatch()

  useEffect(() => {
    const updateRoutine = setInterval(() => {
      setSeconds( Math.floor( stopwatch.getElapsedRunningTime() / 1000 ) )
    }, 250)
    return () => clearInterval(updateRoutine)
  }, [stopwatch])

  // Pause when window goes out of focus
  useEffect(() => {
    const onBlur = () => {
      if (!gameOver) setIsPaused(true)
    }
    window.addEventListener("blur", onBlur)
    
    return () => window.removeEventListener("blur", onBlur)
  }, [gameOver])

  // Set corresponding flags
  useEffect(() => {
    if (gameState === "in-progress" && !isPaused)
      stopwatch.isStarted() ? stopwatch.resume() : stopwatch.start()
    else
      stopwatch.pause()

    setGameOver(gameState === "won" || gameState === "lost")
  }, [gameState, isPaused, stopwatch])

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
      setIsPaused(false)
      setGameState("uninitialized")
      stopwatch.stop()
    }, [resetCounter, stopwatch])

  const header_mid = (
    !gameOver ?
      <button className="header__elem button focusable" 
        onClick={() => setIsPaused(true)}>
        Pause
      </button>
    :
      <p className="header__elem status">
      {
        isPaused ? "Paused" :
        `You ${gameState === "won" ? "won" : "lost"}`
      }
      </p>
  )

  const { width, height, numMines } = boardParams

  return (
    <div className="game">
      <header className="game__header">
        <div className="header__elem score">
          <TimeIcon className="icon" />
          <Duration 
            className="value"
            seconds={seconds}
            />
        </div>

        { header_mid }

        <div className="header__elem score">
          <MineIcon className="icon" />
          <p className="value">
            {flagCount}/{numMines}
          </p>
        </div>
      </header>
      <section className="game__board">
        <Board 
          resetCounter={resetCounter}
          onUpdate={updateGameState} 
          {...boardParams}/>
        { 
          !gameOver && isPaused && 
          <GameMenu 
            boardParams={boardParams}
            onResume={() => setIsPaused(false)}
            onNewGame={resetBoard}
          /> 
        }
      </section>
      <footer className="game__footer">
        <p className="footer__board-desc">
          { capitalizeFirstChar(getDifficulty(boardParams)) }
          : ({width}x{height} cells, {numMines} mines)
        </p>
        <button className="footer__theme-btn focusable" value="theme">
          <ThemeIcon />
        </button>
      </footer>
    </div> 
  )
}

export default Game