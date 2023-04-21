import React, { useCallback, useRef } from 'react'
import * as A from 'fp-ts/lib/Array'
import { flow, pipe } from 'fp-ts/lib/function'
import { type FC } from 'react'
import Cell from './cell/Cell'
import type { Board as TBoard, Vector2 } from './types'
import type { Cell as TCell } from './cell/types'

import classes from './Board.module.css'
import useElementWidth from '../../hooks/useElementWidth'
import useDebounce from '../../hooks/useDebounce'
import { getWidth } from './boardFunctions'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { markCell, revealCell } from './boardSlice'
import { determineGameState } from '../game/gameFunctions'

interface Props {
  board: TBoard
  revealMine: boolean
  onRevealCell: (position: Vector2) => void
  onMarkCell: (position: Vector2) => void
}

export const Board: FC<Props> = ({
  board,
  revealMine,
  onRevealCell,
  onMarkCell,
}) => {
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
  const createRightClickCallback = (position: Vector2) => () => {
    onMarkCell(position)
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
          onRightClick={createRightClickCallback({ x, y })}
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

export const withBoardState = (Component: FC<Props>) => {
  const NewComponent: FC = () => {
    const board = useAppSelector((state) => state.board)

    const dispatch = useAppDispatch()

    const revealMine = determineGameState(board) === 'lost'
    const onRevealCell = useCallback(flow(revealCell, dispatch), [])
    const onMarkCell = useCallback(flow(markCell, dispatch), [])

    return (
      <Component
        board={board}
        revealMine={revealMine}
        onRevealCell={onRevealCell}
        onMarkCell={onMarkCell}
      />
    )
  }

  return NewComponent
}

export default withBoardState(Board)
