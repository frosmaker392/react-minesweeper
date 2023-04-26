import React, { type ComponentProps, type FC } from 'react'
import type GameFooter from './GameFooter'
import { useAppSelector } from '../../../app/hooks'

type Props = ComponentProps<typeof GameFooter>

const withGameFooterState = (Component: FC<Props>) => {
  const NewComponent: FC = () => {
    const { boardParams, difficulty } = useAppSelector((state) => state.game)

    return <Component boardParams={boardParams} difficulty={difficulty} />
  }

  return NewComponent
}

export default withGameFooterState
