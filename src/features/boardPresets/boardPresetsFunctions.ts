import type { BoardParams } from '../board/types'
import type { BoardPresets, Difficulty } from './types'

type DifficultyLevels = Exclude<Difficulty, 'custom'>

export const getBoardParams = (
  difficulty: DifficultyLevels,
  boardPresets: BoardPresets
): BoardParams => boardPresets[difficulty]

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
