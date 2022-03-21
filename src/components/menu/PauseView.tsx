interface IPauseProps {
  onResume: () => void
  onRestart: () => void
  onNewGame: () => void
}

const PauseView = ({ onResume, onRestart, onNewGame }: IPauseProps) => {
  return (
    <div className="menuView pause">
      <button className="focusable" onClick={onResume}>Resume</button>
      <button className="focusable" onClick={onRestart}>Restart</button>
      <button className="focusable" onClick={onNewGame}>New Game</button>
    </div>
  )
}

export default PauseView