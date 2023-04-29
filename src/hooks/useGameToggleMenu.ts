import { useAppDispatch, useAppSelector } from '../app/hooks'
import { setShowMenu } from '../features/menu/menuSlice'

const useGameToggleMenu = () => {
  const showMenu = useAppSelector((state) => state.menu.showMenu)

  const dispatch = useAppDispatch()

  return () => {
    dispatch(setShowMenu(!showMenu))
  }
}

export default useGameToggleMenu
