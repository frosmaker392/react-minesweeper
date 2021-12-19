import { useState } from 'react'
import { BoardLogic, IBoard } from '../utils/BoardLogic'
import Board from './Board'
import GameParams from './GameParams'
import Stopwatch from './Stopwatch'

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

    if (hasWon || hasLost) setPaused(true)
    if (hasWon) setGameState("won")
    else if (hasLost) setGameState("lost")
  }

  return <div className="game">
    <div className="game header">
      <Stopwatch paused={paused} />
      {
        gameState === "in_progress" &&
        <button onClick={onPauseButton}>
          {paused ? "Unpause" : "Pause"}
        </button>
      }

      <p>Flagged: {flagCount} / {boardProps.numMines}</p>

      { gameState !== "in_progress" &&
        <p>
          You {gameState}!
        </p> 
      }
    </div>
    <Board onUpdate={onUpdate} {...boardProps}/>
    <GameParams init={initParams} setter={setBoardProps} />
  </div>
}

export default Game