import { type PayloadAction, createSlice } from '@reduxjs/toolkit'
import { create, setIsPaused, update } from './stopwatchFunctions'
import type { Stopwatch } from './types'

const initialState: Stopwatch = create(Date.now)

export const stopwatchSlice = createSlice({
  name: 'stopwatch',
  initialState,
  reducers: {
    update: (state) => {
      return update(Date.now)(state)
    },
    setIsPaused: (state, action: PayloadAction<boolean>) => {
      return setIsPaused(Date.now)(action.payload)(state)
    },
    reset: () => {
      return create(Date.now)
    },
  },
})

export const {
  update: updateStopwatch,
  setIsPaused: setStopwatchIsPaused,
  reset: resetStopwatch,
} = stopwatchSlice.actions

export default stopwatchSlice.reducer
