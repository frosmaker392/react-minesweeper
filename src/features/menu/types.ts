import type { BoardParams } from '../board/types'

export type ViewType = 'pause' | 'newGame' | 'howToPlay'

export const difficultyList = [
  'beginner',
  'intermediate',
  'advanced',
  'custom',
] as const

export type Difficulty = (typeof difficultyList)[number]
export type BoardPresets = Record<Exclude<Difficulty, 'custom'>, BoardParams>

export interface MenuState {
  showMenu: boolean
  currentView: ViewType
  boardSetup: {
    difficulty: Difficulty
    boardParams: BoardParams
    lastCustomPreset: BoardParams
  }
}
