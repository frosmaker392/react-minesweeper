import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { BoardParams } from '../board/types'
import type { ViewType, MenuState } from './types'
import { boardPresets } from '../board/presets/boardPresets'
import type { Difficulty } from '../board/presets/types'

const initialState: MenuState = {
  showMenu: false,
  currentView: 'pause',
  boardSetup: {
    difficulty: 'beginner',
    boardParams: boardPresets.beginner,
    lastCustomPreset: {
      width: 10,
      height: 10,
      mineCount: 12,
    },
  },
}

export const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setShowMenu: (state, { payload: showMenu }: PayloadAction<boolean>) => {
      if (showMenu) {
        state.showMenu = true
        state.currentView = 'pause'
      } else state.showMenu = false
    },
    changeView: (state, action: PayloadAction<ViewType>) => {
      if (state.showMenu) state.currentView = action.payload
    },
    setDifficulty: ({ boardSetup }, action: PayloadAction<Difficulty>) => {
      boardSetup.difficulty = action.payload

      if (action.payload === 'custom')
        boardSetup.boardParams = boardSetup.lastCustomPreset
      else boardSetup.boardParams = boardPresets[action.payload]
    },
    setBoardParams: ({ boardSetup }, action: PayloadAction<BoardParams>) => {
      boardSetup.difficulty = 'custom'
      boardSetup.boardParams = action.payload
      boardSetup.lastCustomPreset = action.payload
    },
    cacheCustomPreset: ({ boardSetup }, action: PayloadAction<BoardParams>) => {
      boardSetup.lastCustomPreset = action.payload
    },
  },
})

export const {
  setShowMenu,
  changeView,
  setDifficulty,
  setBoardParams,
  cacheCustomPreset,
} = menuSlice.actions

export default menuSlice.reducer
