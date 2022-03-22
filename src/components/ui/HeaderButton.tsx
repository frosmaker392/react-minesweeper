import { BoardState } from "../../utils/BoardLogic"

interface IHeaderButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  gameState: BoardState
  showMenu: boolean
}

const HeaderButton = ({ gameState, showMenu, ...btnProps }: IHeaderButtonProps) => {
  let label = "Back";

  switch (gameState) {
    case "in-progress":
      label = showMenu ? "Resume" : "Pause"
      break

    case "won":
      !showMenu && (label = "You won!")
      break

    case "lost":
      !showMenu && (label = "You lost!")
      break
  
    default:
      !showMenu && (label = "Menu")
      break
  }

  return <button {...btnProps}> {label} </button>
}

export default HeaderButton