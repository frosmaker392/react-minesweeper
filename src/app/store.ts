import { configureStore } from '@reduxjs/toolkit'

import boardReducer from '../features/board/boardSlice'
import menuReducer from '../features/menu/menuSlice'
import stopwatchReducer from '../features/stopwatch/stopwatchSlice'

const store = configureStore({
  reducer: {
    board: boardReducer,
    menu: menuReducer,
    stopwatch: stopwatchReducer,
  },
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
