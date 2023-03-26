import React, { useCallback, useEffect, useState } from 'react'
import { type IBoard, type BoardState } from '../utils/BoardLogic'
import Stopwatch from '../utils/Stopwatch'

import Board from './Board'
import GameMenu from './menu/GameMenu'
import GameHeader from './ui/GameHeader'
import GameFooter from './ui/GameFooter'

import '../styles/Game.css'
import '../styles/GameMenu.css'

const initParams: IBoard = {
  width: 10,
  height: 10,
  numMines: 10,
}

const Game: React.FC = () => {
  const [boardParams, setBoardParams] = useState(initParams)

  const [gameState, setGameState] = useState('uninitialized' as BoardState)
  const [isPaused, setIsPaused] = useState(true)
  const [showMenu, setShowMenu] = useState(false)

  const [seconds, setSeconds] = useState(0)
  const [flagCount, setFlagCount] = useState(0)
  const [resetCounter, setResetCounter] = useState(0)

  const [stopwatch] = useState(new Stopwatch())

  const isGameOver = useCallback(() => {
    return gameState === 'won' || gameState === 'lost'
  }, [gameState])

  useEffect(() => {
    // Routine to update the seconds variable
    const updateRoutine = setInterval(() => {
      setSeconds(Math.floor(stopwatch.elapsedMs / 1000))
    }, 150)

    // Pause when window goes out of focus
    const onBlur = (): void => {
      if (!isGameOver()) setShowMenu(true)
    }
    window.addEventListener('blur', onBlur)

    return () => {
      clearInterval(updateRoutine)
      window.removeEventListener('blur', onBlur)
    }
  }, [stopwatch, isGameOver])

  // Set when exactly to pause the stopwatch
  useEffect(() => {
    if (gameState !== 'in-progress' || showMenu) setIsPaused(true)
    else setIsPaused(false)
  }, [gameState, showMenu])

  // Pause stopwatch effect
  useEffect(() => {
    if (isPaused) stopwatch.pause()
    else stopwatch.startOrResume()
  }, [isPaused, stopwatch])

  // Updates gameState and flagCnt
  const updateGameState = useCallback((state: BoardState, flagCnt: number) => {
    setGameState(state)
    setFlagCount(flagCnt)
  }, [])

  // Resets board according to boardParams
  const resetBoard = useCallback(
    (boardParams: IBoard) => {
      setResetCounter(resetCounter + 1)
      setBoardParams(boardParams)
      setShowMenu(false)
      setGameState('uninitialized')
      stopwatch.reset()
    },
    [resetCounter, stopwatch]
  )

  return (
    <div className="game">
      <GameHeader
        gameState={gameState}
        elapsedSeconds={seconds}
        flaggedMines={flagCount}
        numMines={boardParams.numMines}
        showMenu={showMenu}
        onMenuBtn={setShowMenu}
      />

      <section className="board-container">
        <Board
          resetCounter={resetCounter}
          onUpdate={updateGameState}
          {...boardParams}
        />
        {showMenu ? (
          <GameMenu boardParams={boardParams} onNewGame={resetBoard} />
        ) : (
          isGameOver() && <div className="board-overlay" />
        )}
      </section>

      <GameFooter boardParams={boardParams} />
    </div>
  )
}

export default Game
