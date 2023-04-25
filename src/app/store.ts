import { configureStore } from '@reduxjs/toolkit'

import gameReducer from '../features/game/gameSlice'
import menuReducer from '../features/menu/menuSlice'
import stopwatchReducer from '../features/stopwatch/stopwatchSlice'

const store = configureStore({
  reducer: {
    game: gameReducer,
    menu: menuReducer,
    stopwatch: stopwatchReducer,
  },
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
