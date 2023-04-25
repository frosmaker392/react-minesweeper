import React, { type FC } from 'react'
import Button from '../../components/atoms/Button'

import { ReactComponent as ClockIcon } from '../../icons/Clock.svg'
import { ReactComponent as MineIcon } from '../../icons/Mine.svg'
import type { BoardState } from './types'

import classes from './GameHeader.module.css'

interface Props {
  boardState: BoardState
  isPaused: boolean
  elapsedSeconds: number
  flaggedCellsCount: number
  mineCount: number
  onClickMenuButton: () => void
}

export const toMinutesAndSeconds = (seconds: number): [number, number] => [
  seconds % 60,
  Math.floor(seconds / 60),
]

export const formatDuration = (val: number): string =>
  String(val).padStart(2, '0')

export const headerButtonLabels: Record<BoardState, [string, string]> = {
  uninitialized: ['Menu', 'Resume'],
  'in-progress': ['Pause', 'Resume'],
  won: ['You won!', 'Back'],
  lost: ['You lost!', 'Back'],
}

const GameHeader: FC<Props> = (props) => {
  const {
    boardState,
    isPaused,
    elapsedSeconds,
    flaggedCellsCount,
    mineCount,
    onClickMenuButton,
  } = props

  const [minutes, seconds] =
    toMinutesAndSeconds(elapsedSeconds).map(formatDuration)

  return (
    <header className={classes.gameHeader}>
      <article className={classes.score}>
        <div className={classes.icon}>
          <ClockIcon />
        </div>
        <time className={classes.value}>
          <span>{minutes}</span>:{seconds}
        </time>
      </article>

      <Button
        onClick={() => {
          onClickMenuButton()
        }}
      >
        {headerButtonLabels[boardState][isPaused ? 1 : 0]}
      </Button>

      <article className={classes.score}>
        <MineIcon className={classes.icon} />
        <p className={classes.value}>
          {flaggedCellsCount}
          <span>/{mineCount}</span>
        </p>
      </article>
    </header>
  )
}

export default GameHeader
