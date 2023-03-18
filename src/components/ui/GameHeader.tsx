import React from 'react'
import { type BoardState } from '../../utils/BoardLogic'

import HeaderButton from './HeaderButton'

import { ReactComponent as ClockIcon } from '../../icons/Clock.svg'
import { ReactComponent as MineIcon } from '../../icons/Mine.svg'

import '../../styles/ui/GameHeader.css'

interface IGameHeaderProps {
  gameState: BoardState
  elapsedSeconds: number
  flaggedMines: number
  numMines: number
  showMenu: boolean
  onMenuBtn: (isPaused: boolean) => void
}

const GameHeader: React.FC<IGameHeaderProps> =
props => {
  const {
    gameState, elapsedSeconds, flaggedMines, numMines,
    showMenu, onMenuBtn
  } = props

  const format = (val: number): string => String(val).padStart(2, '0')
  const seconds = format(elapsedSeconds % 60)
  const minutes = format(Math.floor(elapsedSeconds / 60))

  return (
    <header className='game-header'>
      <article className='score'>
        <div className='icon'>
          <ClockIcon />
        </div>
        <time className='value'> <span>{minutes}</span>:{seconds} </time>
      </article>

      <HeaderButton
        gameState={gameState}
        showMenu={showMenu}
        className='clickable'
        onClick={() => { onMenuBtn(!showMenu) }} />

      <article className='score'>
        <MineIcon className='icon' />
        <p className='value'> {flaggedMines}<span>/{numMines}</span> </p>
      </article>
    </header>
  )
}

export default GameHeader
