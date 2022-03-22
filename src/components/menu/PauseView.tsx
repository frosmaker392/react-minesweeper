import MenuButton from "./MenuButton"

interface IPauseProps {
  onRestart: () => void
  onNewGame: () => void
  onHowToPlay: () => void
}

const PauseView = ({ onRestart, onNewGame, onHowToPlay }: IPauseProps) => {
  return (
    <div className="menuView pause">
      <MenuButton onClick={onRestart}>Restart</MenuButton>
      <MenuButton onClick={onNewGame}>New Game</MenuButton>
      <MenuButton onClick={onHowToPlay}>How to Play</MenuButton>
    </div>
  )
}

export default PauseView