import React from 'react'
import { flow, pipe } from 'fp-ts/lib/function'
import * as E from 'fp-ts/lib/Either'
import { useCallback, type FC } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import type { Board as TBoard, BoardParams } from '../board/types'
import { changeView, setBoardParams, setDifficulty } from './menuSlice'
import type { ViewType } from './types'

import PauseView from './views/PauseView'
import { generateBoard } from '../board/boardFunctions'
import NewGameView from './views/NewGameView'
import HowToPlayView from './views/HowToPlayView'

import classes from './GameMenu.module.css'
import type { Difficulty } from '../board/presets/types'

interface Props {
  showMenu: boolean
  currentView: ViewType
  setupDifficulty: Difficulty
  setupParams: BoardParams
  onChangeSetupDifficulty: (difficulty: Difficulty) => void
  onChangeSetupParams: (params: BoardParams) => void
  onChangeView: (view: ViewType) => void
  onReset: (newBoard: TBoard) => void
}

interface WithGameMenuStateProps {
  onReset: (newBoard: TBoard) => void
}

export const GameMenu: FC<Props> = (props) => {
  const { showMenu, currentView, setupDifficulty, setupParams } = props
  const { onChangeSetupDifficulty, onChangeSetupParams } = props
  const { onChangeView, onReset } = props

  const returnToPause = () => {
    onChangeView('pause')
  }

  const pauseCallbacks = {
    onRestart: () => {
      pipe(setupParams, generateBoard, E.match(console.error, onReset))
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
    onSubmit: flow(generateBoard, E.match(console.error, onReset)),
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
  const NewComponent: FC<WithGameMenuStateProps> = ({ onReset }) => {
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
    const onChangeView = useCallback(flow(changeView, dispatch), [])

    const props: Props = {
      showMenu,
      currentView,
      setupDifficulty: difficulty,
      setupParams: boardParams,
      onChangeSetupDifficulty,
      onChangeSetupParams,
      onReset,
      onChangeView,
    }

    return <Component {...props} />
  }

  return NewComponent
}

export default withMenuState(GameMenu)
