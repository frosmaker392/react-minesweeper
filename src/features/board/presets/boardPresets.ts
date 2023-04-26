import type { BoardParams } from '../types'
import type { BoardPresets, Difficulty } from './types'

type DifficultyLevels = Exclude<Difficulty, 'custom'>

export const boardPresets: BoardPresets = {
  beginner: {
    width: 8,
    height: 8,
    mineCount: 10,
  },
  intermediate: {
    width: 16,
    height: 16,
    mineCount: 40,
  },
  advanced: {
    width: 30,
    height: 16,
    mineCount: 99,
  },
}

export const determineDifficulty = (
  boardParams: BoardParams,
  boardPresets: BoardPresets
): Difficulty => {
  for (const key of Object.keys(boardPresets)) {
    const difficulty = key as DifficultyLevels

    const { width, height, mineCount } = boardPresets[difficulty]
    if (
      width === boardParams.width &&
      height === boardParams.height &&
      mineCount === boardParams.mineCount
    )
      return difficulty
  }

  return 'custom'
}
