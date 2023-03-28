import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { BoardParams } from '../board/types'
import type { BoardPresets, BoardPresetsState } from './types'

const initialState: BoardPresetsState = {
  lastCustomPreset: {
    width: 10,
    height: 10,
    mineCount: 12,
  },
}

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

export const boardPresetsSlice = createSlice({
  name: 'boardPresets',
  initialState,
  reducers: {
    cacheCustomPreset: (state, action: PayloadAction<BoardParams>) => {
      state.lastCustomPreset = action.payload
    },
  },
})
