export type ViewType = 'pause' | 'newGame' | 'howToPlay'

export interface MenuState {
  showMenu: boolean
  currentView: ViewType
}
