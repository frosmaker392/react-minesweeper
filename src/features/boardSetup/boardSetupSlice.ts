import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { BoardParams } from '../board/types'
import { getBoardParams } from './boardSetupFunctions'
import type { BoardPresets, BoardSetup, Difficulty } from './types'

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

const initialState: BoardSetup = {
  currentParams: boardPresets.beginner,
  currentDifficulty: 'beginner',
  lastCustomPreset: {
    width: 10,
    height: 10,
    mineCount: 12,
  },
}

export const boardSetupSlice = createSlice({
  name: 'boardPresets',
  initialState,
  reducers: {
    cacheCustomPreset: (state, action: PayloadAction<BoardParams>) => {
      state.lastCustomPreset = action.payload
    },
    setDifficulty: (state, action: PayloadAction<Difficulty>) => {
      state.currentDifficulty = action.payload

      if (action.payload === 'custom')
        state.currentParams = state.lastCustomPreset
      else state.currentParams = getBoardParams(action.payload, boardPresets)
    },
    updateBoardParams: (state, action: PayloadAction<BoardParams>) => {
      state.currentDifficulty = 'custom'
      state.currentParams = action.payload
      state.lastCustomPreset = action.payload
    },
  },
})

export const { cacheCustomPreset, setDifficulty, updateBoardParams } =
  boardSetupSlice.actions

export default boardSetupSlice.reducer
