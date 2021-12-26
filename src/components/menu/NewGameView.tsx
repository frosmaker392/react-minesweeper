import { ChangeEvent, useCallback, useEffect, useState } from "react"
import { IBoard } from "../../utils/BoardLogic"
import boardPresets from "../../utils/BoardPresets"

import IntegerInput from "../utils/IntegerInput"

type Difficulty = "custom" | keyof (typeof boardPresets)

interface INewGameProps {
  boardParams: IBoard
  onSubmit: (boardParams: IBoard) => void
  onCancel: () => void
}

const NewGameView = ({boardParams, onSubmit, onCancel}: INewGameProps) => {
  const [width, setWidth] = useState(boardParams.width)
  const [height, setHeight] = useState(boardParams.height)
  const [numMines, setNumMines] = useState(boardParams.numMines)
  const [curDifficulty, setCurDifficulty] = useState("custom" as Difficulty)

  useEffect(() => {
    if (curDifficulty !== "custom") {
      const preset = boardPresets[curDifficulty]
      setWidth(preset.width)
      setHeight(preset.height)
      setNumMines(preset.numMines)
    }
  }, [curDifficulty])

  const onDifficultyChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const difficulty = e.target.value as Difficulty
      setCurDifficulty(difficulty)
    }, [])

  const onInputChange = 
    (setter: (v: number) => void) => {
      return (val: number) => {
        setCurDifficulty("custom")
        setter(val)
      }
    }

  const presetOptions = 
    Object.keys(boardPresets).map((key, i) => 
      <option key={i} value={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</option>)

  return (
    <form className="menu__view view-new-game" onSubmit={e => {
      e.preventDefault()
      onSubmit({width, height, numMines})
    }}>
      <label className="menu__label" htmlFor="diff-select" >Difficulty</label>
      <select className="menu__input focusable" id="diff-select"
        value={curDifficulty}
        onChange={onDifficultyChange}>
        <option value="custom">Custom</option>
        {presetOptions}
      </select>

      <label className="menu__label" htmlFor="width">Width</label>
      <IntegerInput className="menu__input focusable-inner" id="width" 
        range={[5, 30]} value={width} setter={onInputChange(setWidth)} />

      <label htmlFor="height">Height</label>
      <IntegerInput className="menu__input focusable-inner" id="height" 
        range={[5, 30]} value={height} setter={onInputChange(setHeight)} />

      <label htmlFor="mines">Mines</label>
      <IntegerInput className="menu__input focusable-inner" id="mines" 
        range={[0, width * height / 2]} value={numMines} setter={onInputChange(setNumMines)} />
      
      <button type="submit" className="button focusable" name="submit">
        Generate
      </button>
      <button className="button focusable" name="cancel" onClick={onCancel}>
        Cancel
      </button>
    </form>
  )
}

export default NewGameView