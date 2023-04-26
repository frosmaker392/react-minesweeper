import { describe, expect, test } from 'vitest'
import type { BoardParams } from '../board/types'
import menuReducer, {
  cacheCustomPreset,
  changeView,
  setDifficulty,
  toggleShowMenu,
  setBoardParams,
} from './menuSlice'
import type { MenuState } from './types'
import { boardPresets } from '../board/presets/boardPresets'

const menuState: MenuState = {
  showMenu: false,
  currentView: 'howToPlay',
  boardSetup: {
    difficulty: 'advanced',
    boardParams: boardPresets.advanced,
    lastCustomPreset: {
      width: 10,
      height: 10,
      mineCount: 12,
    },
  },
}

const shownMenuState: MenuState = {
  ...menuState,
  showMenu: true,
}

describe('menuSlice', () => {
  describe('toggleShowMenu', () => {
    test('hides menu if showMenu is true', () => {
      expect(menuReducer(shownMenuState, toggleShowMenu())).toEqual<MenuState>({
        ...shownMenuState,
        showMenu: false,
      })
    })

    test('shows menu with "pause" as current view if showMenu is false', () => {
      expect(menuReducer(menuState, toggleShowMenu())).toEqual<MenuState>({
        ...menuState,
        showMenu: true,
        currentView: 'pause',
      })
    })
  })

  describe('changeView', () => {
    test('does nothing if menu is not shown', () => {
      expect(menuReducer(menuState, changeView('newGame'))).toEqual(menuState)
    })

    test('changes view to given view if menu is shown', () => {
      expect(
        menuReducer(shownMenuState, changeView('pause'))
      ).toEqual<MenuState>({
        ...shownMenuState,
        currentView: 'pause',
      })
    })
  })

  describe('setDifficulty', () => {
    test('sets boardParams to the correct board preset given by difficulty', () => {
      const resultBeginner = menuReducer(menuState, setDifficulty('beginner'))
      const resultIntermediate = menuReducer(
        menuState,
        setDifficulty('intermediate')
      )
      const resultAdvanced = menuReducer(menuState, setDifficulty('advanced'))

      expect(resultBeginner.boardSetup).toEqual<MenuState['boardSetup']>({
        ...menuState.boardSetup,
        difficulty: 'beginner',
        boardParams: boardPresets.beginner,
      })
      expect(resultIntermediate.boardSetup).toEqual<MenuState['boardSetup']>({
        ...menuState.boardSetup,
        difficulty: 'intermediate',
        boardParams: boardPresets.intermediate,
      })
      expect(resultAdvanced.boardSetup).toEqual<MenuState['boardSetup']>({
        ...menuState.boardSetup,
        difficulty: 'advanced',
        boardParams: boardPresets.advanced,
      })
    })

    test('sets currentParams as lastCustomPreset with "custom" difficulty', () => {
      expect(
        menuReducer(menuState, setDifficulty('custom')).boardSetup
      ).toEqual<MenuState['boardSetup']>({
        ...menuState.boardSetup,
        difficulty: 'custom',
        boardParams: menuState.boardSetup.lastCustomPreset,
      })
    })
  })

  describe('updateBoardParams', () => {
    test('sets currentDifficulty to "custom" and updates other params', () => {
      const boardParams: BoardParams = {
        width: 80,
        height: 80,
        mineCount: 12,
      }

      expect(
        menuReducer(menuState, setBoardParams(boardParams)).boardSetup
      ).toEqual<MenuState['boardSetup']>({
        difficulty: 'custom',
        boardParams,
        lastCustomPreset: boardParams,
      })
    })
  })

  describe('cacheCustomPreset', () => {
    test('caches given board preset in lastCustomPreset', () => {
      const toCache: BoardParams = {
        width: 12,
        height: 12,
        mineCount: 15,
      }
      const result = menuReducer(menuState, cacheCustomPreset(toCache))
      expect(result.boardSetup).toEqual<MenuState['boardSetup']>({
        ...menuState.boardSetup,
        lastCustomPreset: toCache,
      })
    })
  })
})
