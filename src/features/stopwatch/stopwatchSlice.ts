import { createSlice } from '@reduxjs/toolkit'
import { createStopwatch, togglePause, update } from './stopwatchFunctions'
import type { Stopwatch } from './types'

const initialState: Stopwatch = createStopwatch(Date.now())

export const stopwatchSlice = createSlice({
  name: 'stopwatch',
  initialState,
  reducers: {
    update: (state) => {
      state = update(Date.now())(state)
    },
    togglePause: (state) => {
      state = togglePause(Date.now())(state)
    },
    reset: (state) => {
      state = createStopwatch(Date.now())
    },
  },
})

export default stopwatchSlice.reducer
