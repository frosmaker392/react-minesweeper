import React, { ButtonHTMLAttributes } from 'react'
import { BoardState } from '../../utils/BoardLogic'

interface IHeaderButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  gameState: BoardState
  showMenu: boolean
}

const labels: Record<BoardState, [string, string]> = {
  uninitialized : ['Menu', 'Resume'],
  'in-progress' : ['Pause', 'Resume'],
  won           : ['You won!', 'Back'],
  lost          : ['You lost!', 'Back']
}

const HeaderButton: React.FC<IHeaderButtonProps> = 
({ gameState, showMenu, ...btnProps }) => 
  <button {...btnProps}>
   { labels[gameState][showMenu ? 1 : 0] }
  </button>

export default HeaderButton