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
const initialState: Board = E.getOrElse(() => invalidBoard)(
  generateBoard(initialParams)
)

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    markCell: (state, action: PayloadAction<Vector2>) => {
      state = markCellAt(action.payload)(state)
    },
    revealCell: (state, action: PayloadAction<Vector2>) => {
      state = pipe(
        state,
        revealCellAt(action.payload),
        updateCellRoundedCorners
      )
    },
  },
})
