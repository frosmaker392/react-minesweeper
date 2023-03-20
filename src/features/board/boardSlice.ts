import { createSlice } from '@reduxjs/toolkit'
import { generateEmptyBoard } from './boardFunctions'
import { type Board } from './types'

const initialState: Board = generateEmptyBoard(10, 10)

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
  }
})
