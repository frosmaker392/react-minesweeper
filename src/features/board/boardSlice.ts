import * as E from 'fp-ts/Either'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import {
  generateBoard,
  markCellAt,
  revealCellAt,
  updateCellRoundedCorners,
} from './boardFunctions'
import type { Vector2, Board, BoardParams } from './types'
import { pipe } from 'fp-ts/lib/function'

const initialParams: BoardParams = {
  width: 10,
  height: 10,
  mineCount: 10,
}
const invalidBoard: Board = {
  cells: [],
  mineCount: 0,
  initialized: false,
}
export const initialState: Board = pipe(
  generateBoard(initialParams),
  E.getOrElse(() => invalidBoard)
)

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    load: (_, action: PayloadAction<Board>) => {
      return action.payload
    },
    markCell: (state, action: PayloadAction<Vector2>) => {
      return markCellAt(action.payload)(state)
    },
    revealCell: (state, action: PayloadAction<Vector2>) => {
      return pipe(state, revealCellAt(action.payload), updateCellRoundedCorners)
    },
  },
})

export const { load, markCell, revealCell } = boardSlice.actions

export default boardSlice.reducer
