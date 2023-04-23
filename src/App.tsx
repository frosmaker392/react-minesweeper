import React from 'react'

import Game from './features/game/Game'

const App: React.FC = () => (
  <>
    <header>
      <h1>Minesweeper</h1>
    </header>

    <Game />

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
