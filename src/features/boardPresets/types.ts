import type { BoardParams } from '../board/types'

export type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'custom'
export type BoardPresets = Record<Exclude<Difficulty, 'custom'>, BoardParams>

export interface BoardPresetsState {
  lastCustomPreset: BoardParams
}
