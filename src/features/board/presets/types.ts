import type { BoardParams } from '../types'

export const difficultyList = [
  'beginner',
  'intermediate',
  'advanced',
  'custom',
] as const

export type Difficulty = (typeof difficultyList)[number]

export type BoardPresets = Record<Exclude<Difficulty, 'custom'>, BoardParams>
