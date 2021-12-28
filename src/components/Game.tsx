import { IBoard, BoardState } from '../utils/BoardLogic'
import { getDifficulty } from '../utils/BoardPresets'

import { useCallback, useEffect, useState } from 'react'
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
import capitalizeFirstChar from '../utils/Capitalize'
import useClock from '../hooks/useClock'

type GameState = BoardState | "pause-menu"

const initParams: IBoard = {
  width: 10,
  height: 10,
  numMines: 10
}

const Game = () => {
  const [boardParams, setBoardParams] = useState(initParams)

  const [gameState, setGameState] = useState("in-progress" as GameState)
  const [isInit, setIsInit] = useState(false)
  const [isPaused, setIsPaused] = useState(true)
  const [gameOver, setGameOver] = useState(false)

  const [elapsedMs, setElapsedMs] = useState(0)
  const [flagCount, setFlagCount] = useState(0)
  const [resetCounter, setResetCounter] = useState(0)

  const { startClock, stopClock } = useClock(100)

  // Pause when window goes out of focus
  useEffect(() => {
    const onBlur = () => {
      if (!gameOver) setGameState("pause-menu")
    }
    window.addEventListener("blur", onBlur)
    
    return () => window.removeEventListener("blur", onBlur)
  }, [gameOver])

  // Set corresponding flags
  useEffect(() => {
    setIsInit(gameState !== "uninitialized")
    setIsPaused(gameState !== "in-progress")
    setGameOver(gameState === "won" || gameState === "lost")
  }, [gameState])

  useEffect(() => {
    startClock(tickMs => {
      if (isInit && !isPaused && !gameOver)
        setElapsedMs(ms => ms + tickMs)
    })

    return () => stopClock()
  }, [startClock, stopClock, isInit, isPaused, gameOver])

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
      setElapsedMs(0)
      setGameState("uninitialized")
    }, [resetCounter])

  const header_mid = (
    (gameState === "in-progress" || gameState === "uninitialized") ?
      <button className="header__elem button focusable" 
        onClick={() => setGameState("pause-menu")}>
        Pause
      </button>
    :
      <p className="header__elem status">
      {
        gameState === "pause-menu" ? "Paused" :
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
            seconds={Math.floor(elapsedMs / 1000)}
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
          gameState === "pause-menu" && 
          <GameMenu 
            boardParams={boardParams}
            onResume={() => isInit ? setGameState("in-progress") : setGameState("uninitialized")}
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