import { pipe } from 'fp-ts/lib/function'
import React from 'react'

import './App.css'
import Board from './features/board/Board'
import {
  revealCellAt,
  updateCellRoundedCorners,
} from './features/board/boardFunctions'
import { initialState } from './features/board/boardSlice'
import { type Board as TBoard } from './features/board/types'

const board: TBoard = pipe(
  initialState,
  revealCellAt({ x: 3, y: 3 }),
  updateCellRoundedCorners
)

const App: React.FC = () => (
  <>
    <header>
      <h1>Minesweeper</h1>
    </header>

    <Board
      board={board}
      revealMine={false}
      onRevealCell={(pos) => {
        console.log(`reveal at [${pos.x}, ${pos.y}]`)
      }}
    />

    <footer className="footer">
      <p>
        Messily written by{' '}
        <a href="https://github.com/frosmaker392">frosmaker392</a>.
        <a href="https://github.com/frosmaker392/react-minesweeper">
          Source code
        </a>
        .
      </p>
    </footer>
  </>
)

export default App
