import React, { type FC, type ComponentProps } from 'react'
import type Board from '../board/Board'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { markCell, revealCell, updateGameState } from './gameSlice'
import type { Vector2 } from '../board/types'

type BoardProps = ComponentProps<typeof Board>

const withBoardState = (Component: FC<BoardProps>) => {
  const NewComponent: FC = () => {
    const { board, boardState } = useAppSelector((state) => state.game)

    const dispatch = useAppDispatch()

    const revealMine = boardState === 'lost'
    const onRevealCell = (position: Vector2) => {
      dispatch(revealCell(position))
      dispatch(updateGameState())
    }
    const onMarkCell = (position: Vector2) => {
      dispatch(markCell(position))
      dispatch(updateGameState())
    }

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

export default withBoardState
