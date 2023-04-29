import React, { useEffect, type ComponentProps, type FC } from 'react'
import type GameHeader from './GameHeader'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { updateStopwatch } from '../../stopwatch/stopwatchSlice'

type Props = ComponentProps<typeof GameHeader>

interface WithGameHeaderStateProps {
  onClickMenuButton: () => void
}

export const withGameHeaderState = (Component: FC<Props>) => {
  const NewComponent: FC<WithGameHeaderStateProps> = ({
    onClickMenuButton,
  }) => {
    const { board, boardState, flaggedCellsCount } = useAppSelector(
      (state) => state.game
    )
    const isMenuShown = useAppSelector((state) => state.menu.showMenu)
    const elapsedMs = useAppSelector((state) => state.stopwatch.elapsedMs)

    const mineCount = board.mineCount

    const dispatch = useAppDispatch()

    useEffect(() => {
      const intervalTimer = setInterval(() => {
        dispatch(updateStopwatch())
      }, 100)

      return () => {
        clearInterval(intervalTimer)
      }
    }, [])

    return (
      <Component
        boardState={boardState}
        isMenuShown={isMenuShown}
        elapsedSeconds={elapsedMs / 1000}
        flaggedCellsCount={flaggedCellsCount}
        mineCount={mineCount}
        onClickMenuButton={onClickMenuButton}
      />
    )
  }

  return NewComponent
}
