import React, { type FC } from 'react'
import * as REA from 'fp-ts/lib/ReadonlyNonEmptyArray'
import { pipe } from 'fp-ts/lib/function'
import * as S from 'fp-ts/lib/string'

import classes from './GameFooter.module.css'
import type { BoardParams } from '../../board/types'
import type { Difficulty } from '../../board/presets/types'

interface Props {
  boardParams: BoardParams
  difficulty: Difficulty
}

const capitalize = (string: string): string =>
  pipe(string, S.split(''), REA.splitAt(1), ([[firstChar], rest]) =>
    [S.toUpperCase(firstChar), ...rest].join('')
  )

const GameFooter: FC<Props> = ({
  boardParams: { width, height, mineCount },
  difficulty,
}) => (
  <footer className={classes.gameFooter}>
    <p className={classes.description}>
      {capitalize(difficulty)}: ({width}x{height} cells, {mineCount} mines)
    </p>
  </footer>
)

export default GameFooter
