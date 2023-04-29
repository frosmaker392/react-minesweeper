import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { updateGameState } from '../features/game/gameSlice'
import { setStopwatchIsPaused } from '../features/stopwatch/stopwatchSlice'

const useGameUpdate = () => {
  const isMenuShown = useAppSelector((state) => state.menu.showMenu)
  const boardState = useAppSelector((state) => state.game.boardState)

  const dispatch = useAppDispatch()

  useEffect(() => {
    const shouldStopwatchPause = boardState !== 'in-progress' || isMenuShown
    dispatch(setStopwatchIsPaused(shouldStopwatchPause))
  }, [isMenuShown, boardState])

  return () => {
    dispatch(updateGameState())
  }
}

export default useGameUpdate
