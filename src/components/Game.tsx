import { useCallback, useEffect, useState } from 'react'
import { IBoard, BoardState } from '../utils/BoardLogic'
import Stopwatch from '../utils/Stopwatch'

import Board from './Board'
import GameMenu from './menu/GameMenu'
import GameHeader from './ui/GameHeader'
import GameFooter from './ui/GameFooter'

import "../styles/Game.css"
import "../styles/GameMenu.css"

const initParams: IBoard = {
  width: 10,
  height: 10,
  numMines: 10
}

const Game = () => {
  const [boardParams, setBoardParams] = useState(initParams)

  const [gameState, setGameState] = useState("uninitialized" as BoardState)
  const [isPaused, setIsPaused]   = useState(false)
  const [gameOver, setGameOver]   = useState(false)

  const [seconds, setSeconds]           = useState(0)
  const [flagCount, setFlagCount]       = useState(0)
  const [resetCounter, setResetCounter] = useState(0)

  const [stopwatch] = useState(new Stopwatch());

  // Routine to update the seconds variable
  useEffect(() => {
    const updateRoutine = setInterval(() => {
      setSeconds( Math.floor( stopwatch.elapsedMs / 1000 ) )
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
    if (gameState === "in-progress") {
      if (!isPaused) stopwatch.startOrResume()
      else stopwatch.pause()
    }
    else if (gameState === "won" || gameState === "lost") {
      stopwatch.pause()
      setGameOver(true)
    }
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
      stopwatch.reset()
    }, [resetCounter, stopwatch])

  return (
    <div className="game">
      <GameHeader 
        elapsedSeconds={seconds}
        flaggedMines={flagCount}
        numMines={boardParams.numMines}
        isPaused={isPaused}
        onPauseBtn={p => setIsPaused(p)}
      />

      <section className="boardContainer">
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
      
      <GameFooter boardParams={boardParams} />
    </div> 
  )
}

export default Game