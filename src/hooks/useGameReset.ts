import { useAppDispatch } from '../app/hooks'
import { type Board } from '../features/board/types'
import { setBoard, updateGameState } from '../features/game/gameSlice'
import { setShowMenu } from '../features/menu/menuSlice'
import { resetStopwatch } from '../features/stopwatch/stopwatchSlice'

const useGameReset = () => {
  const dispatch = useAppDispatch()

  return (board: Board) => {
    dispatch(setBoard(board))
    dispatch(updateGameState())
    dispatch(setShowMenu(false))
    dispatch(resetStopwatch())
  }
}

export default useGameReset
