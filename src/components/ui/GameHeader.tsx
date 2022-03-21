import { BiTimeFive as TimeIcon } from 'react-icons/bi'
import { GiAbstract016 as MineIcon } from 'react-icons/gi'

import "../../styles/ui/GameHeader.css"

interface IGameHeaderProps {
  elapsedSeconds: number,
  flaggedMines: number,
  numMines: number,
  isPaused: boolean,
  onPauseBtn: (isPaused: boolean) => void
}

const GameHeader = (props: IGameHeaderProps) => {
  const { elapsedSeconds, flaggedMines, numMines } = props
  const { isPaused, onPauseBtn } = props

  const format = (val: number) => String(val).padStart(2, '0')
  const seconds = format(elapsedSeconds % 60)
  const minutes = format(Math.floor(elapsedSeconds / 60))
  const formattedDuration = `${minutes}:${seconds}`

  return (
    <header className='gameHeader'>
      <article className='score'>
        <TimeIcon className='icon' />
        <time className='value'> {formattedDuration} </time>
      </article>

      <button onClick={() => onPauseBtn(!isPaused)}>
        { isPaused ? 'Resume' : 'Pause'}
      </button>

      <article className='score'>
        <MineIcon className='icon' />
        <p className='value'> {flaggedMines}/{numMines} </p>
      </article>
    </header>
  )
}

export default GameHeader