import { ChangeEvent, useState } from "react"
import { IBoard } from "../utils/BoardLogic"

interface IGameParamsProps {
  init: IBoard
  setter: (boardParams: IBoard) => void
}

const GameParams = (props: IGameParamsProps) => {
  const [width, setWidth] = useState(props.init.width)
  const [height, setHeight] = useState(props.init.height)
  const [numMines, setNumMines] = useState(props.init.numMines)

  const setNumericState = (e: ChangeEvent<HTMLInputElement>, stateFun: any) => {
    stateFun(parseInt(e.currentTarget.value))
  }

  return (
  <form className="game params" onSubmit={e => {
    e.preventDefault()
    props.setter({width, height, numMines})
  }}>
    <label>
      Width: 
      <input type="number" step="1" min="3" value={width}
        onChange={(e) => setNumericState(e, setWidth)} />
    </label>
    <label>
      Height: 
      <input type="number" step="1" min="3" value={height}
        onChange={(e) => setNumericState(e, setHeight)} />
    </label>
    <label>
      Mines: 
      <input type="number" step="1" min="3" value={numMines}
        onChange={(e) => setNumericState(e, setNumMines)} />
    </label>
    <input type="submit" value="New game" />
  </form>
  )
}

export default GameParams