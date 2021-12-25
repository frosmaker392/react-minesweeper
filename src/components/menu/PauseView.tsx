interface IPauseProps {
  onResume: () => void
  onRestart: () => void
  onNewGame: () => void
}

const PauseView = ({ onResume, onRestart, onNewGame }: IPauseProps) => {
  return (
    <div className="menu__view view-pause">
      <button className="button" onClick={onResume}>Resume</button>
      <button className="button" onClick={onRestart}>Restart</button>
      <button className="button" onClick={onNewGame}>New Game</button>
    </div>
  )
}

export default PauseView