import React from 'react'
import { flow } from 'fp-ts/lib/function'
import { useCallback, type FC } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { load } from '../board/boardSlice'
import type { Board as TBoard, BoardParams } from '../board/types'
import { changeView, toggleShowMenu } from './menuSlice'
import type { ViewType } from './types'
import type { Difficulty } from '../boardSetup/types'

import './GameMenu.css'
import './views/MenuView.css'

interface Props {
  showMenu: boolean
  currentView: ViewType
  currentDifficulty: Difficulty
  currentParams: BoardParams
  onToggleShowMenu: () => void
  onChangeView: (view: ViewType) => void
  onCreateBoard: (board: TBoard) => void
}

export const GameMenu: FC<Props> = (props) => {
  const { showMenu, currentView } = props
  const { onToggleShowMenu, onChangeView, onCreateBoard } = props

  if (!showMenu) return null

  // Pause view
  if (currentView === 'pause') return null

  // New game view
  if (currentView === 'newGame') return null

  // How to play view
  return null
}

export const withMenuState = (Component: FC<Props>) => {
  const NewComponent: FC = () => {
    const { showMenu, currentView } = useAppSelector((state) => state.menu)

    const dispatch = useAppDispatch()

    const onToggleShowMenu = useCallback(flow(toggleShowMenu, dispatch), [])
    const onChangeView = useCallback(flow(changeView, dispatch), [])
    const onCreateBoard = useCallback(flow(load, dispatch), [])

    const props: Props = {
      showMenu,
      currentView,
      onToggleShowMenu,
      onChangeView,
      onCreateBoard,
    }

    return <Component {...props} />
  }

  return NewComponent
}

export default withMenuState(GameMenu)
