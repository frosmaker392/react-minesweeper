import * as A from 'fp-ts/lib/Array'
import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import type { Board, BoardParams, Vector2 } from '../board/types'
import {
  generateBoard,
  getBoardParams,
  markCellAt,
  revealCellAt,
  updateCellRoundedCorners,
} from '../board/boardFunctions'
import { type GameState } from './types'
import { type PayloadAction, createSlice } from '@reduxjs/toolkit'
import { determineBoardState } from './gameFunctions'
import { isHidden } from '../board/cell/cellFunctions'
import {
  boardPresets,
  determineDifficulty,
} from '../board/presets/boardPresets'
import type { Difficulty } from '../board/presets/types'

const initialDifficulty: Difficulty = 'beginner'
const initialParams: BoardParams = boardPresets[initialDifficulty]
const invalidBoard: Board = {
  cells: [],
  mineCount: 0,
  initialized: false,
}
const initialBoard: Board = pipe(
  generateBoard(initialParams),
  E.getOrElse(() => invalidBoard)
)

export const initialState: GameState = {
  board: initialBoard,
  boardState: 'uninitialized',
  boardParams: initialParams,
  difficulty: initialDifficulty,
  flaggedCellsCount: 0,
}

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setBoard: (state, action: PayloadAction<Board>) => {
      state.board = action.payload

      const boardParams = getBoardParams(action.payload)
      state.difficulty = determineDifficulty(boardParams, boardPresets)
      state.boardParams = boardParams
    },
    markCell: (state, action: PayloadAction<Vector2>) => {
      state.board = markCellAt(action.payload)(state.board)
    },
    revealCell: (state, action: PayloadAction<Vector2>) => {
      state.board = pipe(
        state.board,
        revealCellAt(action.payload),
        updateCellRoundedCorners
      )
    },
    updateGameState: (state) => {
      const boardState = determineBoardState(state.board)

      state.boardState = boardState
      state.flaggedCellsCount = pipe(
        state.board.cells,
        A.flatten,
        A.filter((cell) => isHidden(cell) && cell.markedAs === 'flagged'),
        (cells) => cells.length
      )
    },
  },
})

export const { setBoard, markCell, revealCell, updateGameState } =
  gameSlice.actions

export default gameSlice.reducer
