import { createSlice } from '@reduxjs/toolkit'
import { getResultValue } from '../../utils/Result'
import { generateBoard } from './boardFunctions'
import { type Board } from './types'

const initialState: Board = getResultValue(generateBoard(10, 10, 10))

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
  }
})
