import { IBoard } from "./BoardLogic"

type DiffLevels = "beginner" | "intermediate" | "advanced"
type BoardPreset = {
  [key in DiffLevels]: IBoard
}

const boardPresets: BoardPreset = {
  beginner: {
    width: 8,
    height: 8,
    numMines: 10
  },
  intermediate: {
    width: 16,
    height: 16,
    numMines: 40
  },
  advanced: {
    width: 30,
    height: 16,
    numMines: 99
  }
}

export default boardPresets