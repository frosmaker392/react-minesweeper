import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { type ViewType, type MenuState } from './types'

const initialState: MenuState = {
  showMenu: false,
  currentView: 'pause',
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
  },
})

export const { toggleShowMenu, changeView } = menuSlice.actions

export default menuSlice.reducer
