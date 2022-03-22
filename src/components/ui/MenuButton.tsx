import { BoardState } from "../../utils/BoardLogic"

interface IMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  gameState: BoardState
  showMenu: boolean
}

const MenuButton = ({ gameState, showMenu, ...btnProps }: IMenuButtonProps) => {
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

export default MenuButton