import React, { type FC, type ComponentProps } from 'react'
import type Board from '../board/Board'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { markCell, revealCell } from './gameSlice'
import type { Vector2 } from '../board/types'

type BoardProps = ComponentProps<typeof Board>

interface WithBoardStateProps {
  onUpdate: () => void
}

const withBoardState = (Component: FC<BoardProps>) => {
  const NewComponent: FC<WithBoardStateProps> = ({ onUpdate }) => {
    const { board, boardState } = useAppSelector((state) => state.game)

    const dispatch = useAppDispatch()

    const revealMine = boardState === 'lost'
    const disableInput = boardState === 'lost' || boardState === 'won'
    const onRevealCell = (position: Vector2) => {
      dispatch(revealCell(position))
      onUpdate()
    }
    const onMarkCell = (position: Vector2) => {
      dispatch(markCell(position))
      onUpdate()
    }

    return (
      <Component
        board={board}
        revealMine={revealMine}
        disableInput={disableInput}
        onRevealCell={onRevealCell}
        onMarkCell={onMarkCell}
      />
    )
  }

  return NewComponent
}

export default withBoardState
