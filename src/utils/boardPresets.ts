import { type IBoard } from './BoardLogic'

const DIFF_LEVELS = ['beginner', 'intermediate', 'advanced'] as const

type DiffLevels = (typeof DIFF_LEVELS)[number]
type BoardPreset = {
  [key in DiffLevels]: IBoard
}

const boardPresets: BoardPreset = {
  beginner: {
    width: 8,
    height: 8,
    numMines: 10,
  },
  intermediate: {
    width: 16,
    height: 16,
    numMines: 40,
  },
  advanced: {
    width: 30,
    height: 16,
    numMines: 99,
  },
}

function getDifficulty(boardParams: IBoard): DiffLevels | 'custom' {
  const { width, height, numMines } = boardParams

  for (const difficulty of DIFF_LEVELS) {
    const preset = boardPresets[difficulty]
    if (
      width === preset.width &&
      height === preset.height &&
      numMines === preset.numMines
    ) {
      return difficulty
    }
  }

  return 'custom'
}

export type { DiffLevels }
export { boardPresets, getDifficulty }
