import { ChangeEvent, useCallback, useEffect, useState } from "react"
import { IBoard } from "../../utils/BoardLogic"
import { boardPresets, DiffLevels } from "../../utils/boardPresets"
import capitalizeFirstChar from "../../utils/capitalizeFirstChar"

import IntegerInput from "../utils/IntegerInput"
import StyledSelect from "../utils/StyledSelect"
import MenuButton from "./MenuButton"

type Difficulty = "custom" | DiffLevels

interface INewGameProps {
  boardParams: IBoard
  onSubmit: (boardParams: IBoard) => void
  onReturn: () => void
}

const NewGameView = ({boardParams, onSubmit, onReturn}: INewGameProps) => {
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
    Object.keys(boardPresets).map((diff, i) => 
      <option key={i} value={diff}>{capitalizeFirstChar(diff)}</option>)

  return (
    <form className="menuView newGame" onSubmit={e => {
      e.preventDefault()
      onSubmit({width, height, numMines})
    }}>
      <label htmlFor="diff-select">Difficulty</label>
      <StyledSelect className="clickable input" id="diff-select"
        value={curDifficulty} 
        onChange={onDifficultyChange}>

        <option value="custom">Custom</option>
          {presetOptions}
      </StyledSelect>

      <label htmlFor="width">Width</label>
      <IntegerInput className="input clickable" id="width" 
        range={[5, 30]} value={width} setter={onInputChange(setWidth)} />

      <label htmlFor="height">Height</label>
      <IntegerInput className="input clickable" id="height" 
        range={[5, 30]} value={height} setter={onInputChange(setHeight)} />

      <label htmlFor="mines">Mines</label>
      <IntegerInput className="input clickable" id="mines" 
        range={[0, Math.floor(width * height / 2)]} value={numMines} 
        setter={onInputChange(setNumMines)} />
      
      <MenuButton className="highlight" type="submit" name="submit">
        Generate
      </MenuButton>

      <MenuButton name="cancel" onClick={onReturn}>
        Back
      </MenuButton>
    </form>
  )
}

export default NewGameView