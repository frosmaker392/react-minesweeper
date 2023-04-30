import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { setShowMenu } from '../features/menu/menuSlice'

const useGameToggleMenu = () => {
  const boardState = useAppSelector((state) => state.game.boardState)
  const showMenu = useAppSelector((state) => state.menu.showMenu)

  const dispatch = useAppDispatch()

  useEffect(() => {
    const onBlur = () => {
      boardState === 'in-progress' && dispatch(setShowMenu(true))
    }

    window.addEventListener('blur', onBlur)

    return () => {
      window.removeEventListener('blur', onBlur)
    }
  }, [boardState])

  return () => {
    dispatch(setShowMenu(!showMenu))
  }
}

export default useGameToggleMenu
