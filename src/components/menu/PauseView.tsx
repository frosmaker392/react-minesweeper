interface IPauseProps {
  onRestart: () => void
  onNewGame: () => void
}

const PauseView = ({ onRestart, onNewGame }: IPauseProps) => {
  return (
    <div className="menuView pause">
      <button className="focusable" onClick={onRestart}>Restart</button>
      <button className="focusable" onClick={onNewGame}>New Game</button>
    </div>
  )
}

export default PauseView