import { configureStore } from '@reduxjs/toolkit'

import boardReducer from '../features/board/boardSlice'
import boardSetupReducer from '../features/boardSetup/boardSetupSlice'
import menuReducer from '../features/menu/menuSlice'
import stopwatchReducer from '../features/stopwatch/stopwatchSlice'

export const store = configureStore({
  reducer: {
    board: boardReducer,
    boardSetup: boardSetupReducer,
    menu: menuReducer,
    stopwatch: stopwatchReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
