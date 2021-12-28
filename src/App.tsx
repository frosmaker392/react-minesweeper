import './App.css';
import Game from './components/Game';

function App() {
  return (
    <>
      <header>
        <h1>Minesweeper</h1>
      </header>
      <Game />
      <footer className="footer">
        <p>Hastily written by <a href="https://github.com/frosmaker392">frosmaker392</a>. <a href="https://github.com/frosmaker392/react-minesweeper">Source code</a>.
        </p>
      </footer>
    </>
  );
}

export default App;
