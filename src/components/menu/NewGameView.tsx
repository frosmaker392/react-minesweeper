import { useState } from "react"
import { IBoard } from "../../utils/BoardLogic"

import IntegerInput from "../utils/IntegerInput"

interface INewGameProps {
  boardParams: IBoard
  onSubmit: (boardParams: IBoard) => void
  onCancel: () => void
}

const NewGameView = (props: INewGameProps) => {
  const [width, setWidth] = useState(props.boardParams.width)
  const [height, setHeight] = useState(props.boardParams.height)
  const [numMines, setNumMines] = useState(props.boardParams.numMines)

  return (
    <form className="menu__view view-new-game" onSubmit={e => {
      e.preventDefault()
      props.onSubmit({width, height, numMines})
    }}>
      <label className="menu__label" htmlFor="width">Width</label>
      <IntegerInput className="menu__input" id="width" range={[5, 30]} 
        value={width} onChange={(val) => setWidth(val)} />

      <label htmlFor="height">Height</label>
      <IntegerInput className="menu__input" id="height" range={[5, 30]} 
        value={height} onChange={(val) => setHeight(val)} />

      <label htmlFor="mines">Mines</label>
      <IntegerInput className="menu__input" id="mines" range={[0, width * height / 2]} 
        value={numMines} onChange={(val) => setNumMines(val)} />
      
      <button type="submit" className="button" name="submit">
        Generate
      </button>
      <button className="button" name="cancel" onClick={props.onCancel}>
        Cancel
      </button>
    </form>
  )
}

export default NewGameView