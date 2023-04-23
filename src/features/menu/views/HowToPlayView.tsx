import React, { type FC } from 'react'
import MenuButton from '../../../components/atoms/MenuButton'

import classes from './MenuView.module.css'

interface Props {
  onReturn: () => void
}

const HowToPlayView: FC<Props> = ({ onReturn }) => (
  <div className={`${classes.menuView} ${classes.howToPlay}`}>
    <ul>
      <li>
        Left-click a cell to reveal it. Right-click to mark the cell as flagged
        or unknown.
      </li>
      <li>A revealed cell may show how many mines are surrounding it.</li>
      <li>
        You <b className={classes.dangerHighlight}>lose</b> the game if you
        reveal <b className={classes.dangerHighlight}>any</b> cell with a mine.
      </li>
      <li>
        You <b>win</b> when <b>all</b> cells with mines are correctly marked and
        the rest are revealed.
      </li>
    </ul>

    <MenuButton onClick={onReturn}>Back</MenuButton>
  </div>
)

export default HowToPlayView
