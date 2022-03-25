import { BoardState } from '../../utils/BoardLogic'

import HeaderButton from './HeaderButton'

import { ReactComponent as ClockIcon } from '../../icons/Clock.svg'
import { ReactComponent as MineIcon } from '../../icons/Mine.svg'

import "../../styles/ui/GameHeader.css"

interface IGameHeaderProps {
  gameState: BoardState
  elapsedSeconds: number,
  flaggedMines: number,
  numMines: number,
  showMenu: boolean,
  onMenuBtn: (isPaused: boolean) => void
}

const GameHeader = (props: IGameHeaderProps) => {
  const { gameState, elapsedSeconds, flaggedMines, numMines,
     showMenu, onMenuBtn } = props

  const format = (val: number) => String(val).padStart(2, '0')
  const seconds = format(elapsedSeconds % 60)
  const minutes = format(Math.floor(elapsedSeconds / 60))
  const formattedDuration = `${minutes}:${seconds}`

  return (
    <header className='gameHeader'>
      <article className='score'>
        <div className='icon'>
          <ClockIcon />
        </div>
        <time className='value'> {formattedDuration} </time>
      </article>

      <HeaderButton 
        gameState={gameState}
        showMenu={showMenu}
        onClick={() => onMenuBtn(!showMenu)} />

      <article className='score'>
        <MineIcon className='icon' />
        <p className='value'> {flaggedMines}/{numMines} </p>
      </article>
    </header>
  )
}

export default GameHeader