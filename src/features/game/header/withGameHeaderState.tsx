import React, { type ComponentProps, type FC } from 'react'
import type GameHeader from './GameHeader'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { togglePause } from '../gameSlice'
import { toggleShowMenu } from '../../menu/menuSlice'

type Props = ComponentProps<typeof GameHeader>

export const withGameHeaderState = (Component: FC<Props>) => {
  const NewComponent: FC = () => {
    const { board, isPaused, boardState, flaggedCellsCount } = useAppSelector(
      (state) => state.game
    )
    const elapsedMs = useAppSelector((state) => state.stopwatch.elapsedMs)

    const mineCount = board.mineCount

    const dispatch = useAppDispatch()
    const onClickMenuButton = () => {
      dispatch(togglePause())
      dispatch(toggleShowMenu())
    }

    return (
      <Component
        boardState={boardState}
        isPaused={isPaused}
        elapsedSeconds={elapsedMs / 1000}
        flaggedCellsCount={flaggedCellsCount}
        mineCount={mineCount}
        onClickMenuButton={onClickMenuButton}
      />
    )
  }

  return NewComponent
}
