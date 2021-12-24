import { ChangeEvent, useState } from "react"
import { IBoard } from "../utils/BoardLogic"

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
    <div className="pause-view">
      <button onClick={onResume}>Resume</button>
      <button onClick={onRestart}>Restart</button>
      <button onClick={onNewGame}>New Game</button>
    </div>
  )
}

const NewGameView = (props: INewGameProps) => {
  const [boardParams, setBoardParams] = useState(props.boardParams)

  const setParam = (e: ChangeEvent<HTMLInputElement>, key: keyof IBoard) => {
    const value = parseInt(e.currentTarget.value)
    if (value !== undefined) {
      setBoardParams({...boardParams, [key]:value})
    }
  }

  return (
    <form className="new-game-view" onSubmit={e => {
      e.preventDefault()
      props.onSubmit(boardParams)
    }}>
      <label>
        Width: 
        <input type="number" step="1" min="3" 
          value={boardParams.width}
          onChange={(e) => setParam(e, "width")} />
      </label>
      <label>
        Height: 
        <input type="number" step="1" min="3" 
          value={boardParams.height}
          onChange={(e) => setParam(e, "height")} />
      </label>
      <label>
        Mines: 
        <input type="number" step="1" min="3" 
          value={boardParams.numMines}
          onChange={(e) => setParam(e, "numMines")} />
      </label>

      <input type="submit" name="submit" value="New game" />
      <input type="button" name="cancel" value="Cancel"
        onClick={props.onCancel}/>
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