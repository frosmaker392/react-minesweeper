interface IPauseProps {
  onResume: () => void
  onRestart: () => void
  onNewGame: () => void
}

const PauseView = ({ onResume, onRestart, onNewGame }: IPauseProps) => {
  return (
    <div className="menu__view view-pause">
      <button className="button focusable" onClick={onResume}>Resume</button>
      <button className="button focusable" onClick={onRestart}>Restart</button>
      <button className="button focusable" onClick={onNewGame}>New Game</button>
    </div>
  )
}

export default PauseView