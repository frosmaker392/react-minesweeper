import React from 'react'
import { flow, pipe } from 'fp-ts/lib/function'
import * as E from 'fp-ts/lib/Either'
import { useCallback, type FC } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import type { Board as TBoard, BoardParams } from '../board/types'
import {
  changeView,
  setBoardParams,
  setDifficulty,
  toggleShowMenu,
} from './menuSlice'
import type { Difficulty, ViewType } from './types'

import PauseView from './views/PauseView'
import { generateBoard } from '../board/boardFunctions'
import NewGameView from './views/NewGameView'
import HowToPlayView from './views/HowToPlayView'

import classes from './GameMenu.module.css'
import { setBoard } from '../game/gameSlice'

interface Props {
  showMenu: boolean
  currentView: ViewType
  setupDifficulty: Difficulty
  setupParams: BoardParams
  onChangeSetupDifficulty: (difficulty: Difficulty) => void
  onChangeSetupParams: (params: BoardParams) => void
  onToggleShowMenu: () => void
  onChangeView: (view: ViewType) => void
  onCreateBoard: (board: TBoard) => void
}

export const GameMenu: FC<Props> = (props) => {
  const { showMenu, currentView, setupDifficulty, setupParams } = props
  const { onChangeSetupDifficulty, onChangeSetupParams } = props
  const { onToggleShowMenu, onChangeView, onCreateBoard } = props

  const returnToPause = () => {
    onChangeView('pause')
  }

  const pauseCallbacks = {
    onRestart: () => {
      pipe(
        setupParams,
        generateBoard,
        E.match(console.error, (board) => {
          onCreateBoard(board)
          onToggleShowMenu()
        })
      )
    },
    onNewGame: () => {
      onChangeView('newGame')
    },
    onHowToPlay: () => {
      onChangeView('howToPlay')
    },
  }

  const newGameCallbacks = {
    onChangeDifficulty: onChangeSetupDifficulty,
    onChangeBoardParams: onChangeSetupParams,
    onSubmit: flow(
      generateBoard,
      E.match(console.error, (board) => {
        onCreateBoard(board)
        onToggleShowMenu()
      })
    ),
    onReturn: returnToPause,
  }

  if (!showMenu) return null

  const view =
    currentView === 'pause' ? (
      <PauseView {...pauseCallbacks} />
    ) : currentView === 'newGame' ? (
      <NewGameView
        setupDifficulty={setupDifficulty}
        setupParams={setupParams}
        {...newGameCallbacks}
      />
    ) : (
      <HowToPlayView onReturn={returnToPause} />
    )

  return (
    <div className={`${classes.boardOverlay} ${classes.menu}`}>
      <div className={classes.menuViewContainer}>{view}</div>
    </div>
  )
}

export const withMenuState = (Component: FC<Props>) => {
  const NewComponent: FC = () => {
    const { showMenu, currentView } = useAppSelector((state) => state.menu)
    const { difficulty, boardParams } = useAppSelector(
      (state) => state.menu.boardSetup
    )

    const dispatch = useAppDispatch()

    const onChangeSetupDifficulty = useCallback(
      flow(setDifficulty, dispatch),
      []
    )
    const onChangeSetupParams = useCallback(flow(setBoardParams, dispatch), [])

    const onToggleShowMenu = useCallback(flow(toggleShowMenu, dispatch), [])
    const onChangeView = useCallback(flow(changeView, dispatch), [])
    const onCreateBoard = useCallback(flow(setBoard, dispatch), [])

    const props: Props = {
      showMenu,
      currentView,
      setupDifficulty: difficulty,
      setupParams: boardParams,
      onChangeSetupDifficulty,
      onChangeSetupParams,
      onToggleShowMenu,
      onChangeView,
      onCreateBoard,
    }

    return <Component {...props} />
  }

  return NewComponent
}

export default withMenuState(GameMenu)
