import * as E from 'fp-ts/Either'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { generateBoard, markCellAt, revealCellAt } from './boardFunctions'
import type { Vector2, Board, BoardParams } from './types'

const initialParams: BoardParams = {
  width: 10,
  height: 10,
  mineCount: 10
}
const invalidBoard: Board = {
  cells: [],
  mineCount: 0,
  initialized: false
}
const initialState: Board = E.getOrElse(() => invalidBoard)(generateBoard(initialParams))

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    markCell: (state, action: PayloadAction<Vector2>) => {
      state = markCellAt(state, action.payload)
    },
    revealCell: (state, action: PayloadAction<Vector2>) => {
      state = revealCellAt(state, action.payload)
    }
  }
})
