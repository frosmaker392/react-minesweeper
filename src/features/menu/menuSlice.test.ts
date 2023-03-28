import { describe, expect, test } from 'vitest'
import menuReducer, { changeView, toggleShowMenu } from './menuSlice'
import type { MenuState } from './types'

const menuState: MenuState = {
  showMenu: false,
  currentView: 'howToPlay',
}

const shownMenuState: MenuState = {
  showMenu: true,
  currentView: 'howToPlay',
}

describe('menuSlice', () => {
  describe('toggleShowMenu', () => {
    test('hides menu if showMenu is true', () => {
      expect(menuReducer(shownMenuState, toggleShowMenu())).toEqual({
        ...shownMenuState,
        showMenu: false,
      })
    })

    test('shows menu with "pause" as current view if showMenu is false', () => {
      expect(menuReducer(menuState, toggleShowMenu())).toEqual<MenuState>({
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
        showMenu: true,
        currentView: 'pause',
      })
    })
  })
})
