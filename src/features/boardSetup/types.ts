import type { BoardParams } from '../board/types'

export const difficultyList = [
  'beginner',
  'intermediate',
  'advanced',
  'custom',
] as const

export type Difficulty = (typeof difficultyList)[number]
export type BoardPresets = Record<Exclude<Difficulty, 'custom'>, BoardParams>

export interface BoardSetup {
  currentParams: BoardParams
  currentDifficulty: Difficulty
  lastCustomPreset: BoardParams
}
