import MenuButton from "./MenuButton"

interface IHowToPlayViewProps {
  onReturn: () => void
}

const HowToPlayView = ({ onReturn }: IHowToPlayViewProps) => {
  return (
    <div className="menuView howToPlay">
      <ul>
        <li>Left-click a cell to reveal it. Right-click to mark the cell.</li>
        <li>A revealed cell may show how many mines are surrounding it.</li>
        <li>You lose the game if you reveal <em>any</em> cell with a mine.</li>
        <li>You win when <em>all</em> cells with mines are correctly marked.</li>
      </ul>

      <MenuButton onClick={onReturn}>Back</MenuButton>
    </div>
  )
}

export default HowToPlayView