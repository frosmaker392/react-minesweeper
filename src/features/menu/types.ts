import type { Difficulty } from '../board/presets/types'
import type { BoardParams } from '../board/types'

export type ViewType = 'pause' | 'newGame' | 'howToPlay'

export interface MenuState {
  showMenu: boolean
  currentView: ViewType
  boardSetup: {
    difficulty: Difficulty
    boardParams: BoardParams
    lastCustomPreset: BoardParams
  }
}
