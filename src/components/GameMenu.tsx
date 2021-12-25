import { useState } from "react"
import { IBoard } from "../utils/BoardLogic"

import IntegerInput from "./utils/IntegerInput"

import "../styles/GameMenu.css"

interface IPauseProps {
  onResume: () => void
  onRestart: () => void
  onNewGame: () => void
}

interface INewGameProps {
  boardParams: IBoard
  onSubmit: (boardParams: IBoard) => void
  onCancel: () => void
}

interface IGameMenuProps {
  boardParams: IBoard
  onResume: () => void
  onNewGame: (boardParams: IBoard) => void
}

const PauseView = ({ onResume, onRestart, onNewGame }: IPauseProps) => {
  return (
    <div className="view pause">
      <button className="btn" onClick={onResume}>Resume</button>
      <button className="btn" onClick={onRestart}>Restart</button>
      <button className="btn" onClick={onNewGame}>New Game</button>
    </div>
  )
}

const NewGameView = (props: INewGameProps) => {
  const [width, setWidth] = useState(props.boardParams.width)
  const [height, setHeight] = useState(props.boardParams.height)
  const [numMines, setNumMines] = useState(props.boardParams.numMines)

  return (
    <form className="view new-game" onSubmit={e => {
      e.preventDefault()
      props.onSubmit({width, height, numMines})
    }}>
      <label htmlFor="width">Width</label>
      <IntegerInput className="field" id="width" range={[5, 30]} value={width} 
        onChange={(val) => setWidth(val)} />

      <label htmlFor="height">Height</label>
      <IntegerInput className="field" id="height" range={[5, 30]} value={height} 
        onChange={(val) => setHeight(val)} />

      <label htmlFor="mines">Mines</label>
      <IntegerInput className="field" id="mines" range={[0, width * height / 2]} value={numMines} 
        onChange={(val) => setNumMines(val)} />
      
      <button type="submit" className="btn" name="submit">
        Generate
      </button>
      <button className="btn" name="cancel" onClick={props.onCancel}>
        Cancel
      </button>
    </form>
  )
}

const GameMenu = ({boardParams, onResume, onNewGame}: IGameMenuProps) => {
  const [isPauseView, setIsPauseView] = useState(true)

  return (
    <div className="game menu">
      {
        isPauseView ?
        <PauseView 
          onResume={onResume}
          onRestart={() => onNewGame(boardParams)}
          onNewGame={() => setIsPauseView(false)}
          />
        :
        <NewGameView 
          boardParams={boardParams}
          onSubmit={onNewGame}
          onCancel={() => setIsPauseView(true)}
          />
      }
    </div>
  )
}

export default GameMenu