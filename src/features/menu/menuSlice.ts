import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { BoardParams } from '../board/types'
import { determineDifficulty, getBoardParams } from './menuFunctions'
import type { ViewType, MenuState, Difficulty, BoardPresets } from './types'

export const boardPresets: BoardPresets = {
  beginner: {
    width: 8,
    height: 8,
    mineCount: 10,
  },
  intermediate: {
    width: 16,
    height: 16,
    mineCount: 40,
  },
  advanced: {
    width: 30,
    height: 16,
    mineCount: 99,
  },
}

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
    toggleShowMenu: (state) => {
      if (state.showMenu) state.showMenu = false
      else {
        state.showMenu = true
        state.currentView = 'pause'
      }
    },
    changeView: (state, action: PayloadAction<ViewType>) => {
      if (state.showMenu) state.currentView = action.payload
    },
    setDifficulty: ({ boardSetup }, action: PayloadAction<Difficulty>) => {
      boardSetup.difficulty = action.payload

      if (action.payload === 'custom')
        boardSetup.boardParams = boardSetup.lastCustomPreset
      else boardSetup.boardParams = getBoardParams(action.payload, boardPresets)
    },
    updateDifficulty: ({ boardSetup }) => {
      boardSetup.difficulty = determineDifficulty(
        boardSetup.boardParams,
        boardPresets
      )
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
  toggleShowMenu,
  changeView,
  setDifficulty,
  updateDifficulty,
  setBoardParams,
  cacheCustomPreset,
} = menuSlice.actions

export default menuSlice.reducer
