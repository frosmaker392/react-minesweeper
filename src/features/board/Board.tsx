import React, { useRef } from 'react'
import * as A from 'fp-ts/lib/Array'
import { pipe } from 'fp-ts/lib/function'
import { type FC } from 'react'
import Cell from './Cell'
import type { Board as TBoard, Cell as TCell, Vector2 } from './types'

import classes from './Board.module.css'
import useElementWidth from '../../hooks/useElementWidth'
import useDebounce from '../../hooks/useDebounce'
import { getWidth } from './boardFunctions'

interface Props {
  board: TBoard
  revealMine: boolean
  onRevealCell: (position: Vector2) => void
}

const Board: FC<Props> = ({ board, revealMine, onRevealCell }) => {
  const ref = useRef<HTMLDivElement>(null)

  const fontSize = pipe(
    ref,
    useElementWidth,
    (w) => useDebounce(100, w),
    (w) => Math.floor((w / getWidth(board)) * 0.5)
  )

  const createLeftClickCallback = (position: Vector2) => () => {
    onRevealCell(position)
  }

  const createRow = (y: number, cells: TCell[]) =>
    pipe(
      cells,
      A.mapWithIndex((x, cell) => (
        <Cell
          key={`${x} ${y}`}
          cell={cell}
          revealMine={revealMine}
          fontSize={fontSize}
          onLeftClick={createLeftClickCallback({ x, y })}
          onRightClick={() => {
            console.log('unimplemented right click')
          }}
        />
      )),
      (elems) => (
        <div key={y} className={classes.boardRow}>
          {elems}
        </div>
      )
    )

  return (
    <div ref={ref} className={classes.board}>
      {pipe(board.cells, A.mapWithIndex(createRow))}
    </div>
  )
}

export default Board
