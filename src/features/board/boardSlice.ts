import { createSlice } from '@reduxjs/toolkit'
import { generateEmptyBoard } from './boardFunctions'

type MarkType = 'none' | 'flagged' | 'unknown'

export interface HiddenCell {
  state: 'hidden'
  hasMine: boolean
  markedAs: MarkType
}

export interface RevealedCell {
  state: 'revealed'
  hasMine: boolean
  neighboringMines: number
}

export type Cell = HiddenCell | RevealedCell

export interface Board {
  mineCount: number
  cells: Cell[][]
}

const initialState: Board = generateEmptyBoard(10, 10)

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
  }
})
