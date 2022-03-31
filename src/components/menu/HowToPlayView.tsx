import React from 'react'
import MenuButton from './MenuButton'

interface IHowToPlayViewProps {
  onReturn: () => void
}

const HowToPlayView: React.FC<IHowToPlayViewProps> = 
({ onReturn }) => 
  <div className='menu-view how-to-play'>
    <ul>
      <li>Left-click a cell to reveal it. Right-click to mark the cell as flagged or unknown.</li>
      <li>A revealed cell may show how many mines are surrounding it.</li>
      <li>You <b className='accent-2'>lose</b> the game if you reveal <b className='accent-2'>any</b> cell with a mine.</li>
      <li>You <b>win</b> when <b>all</b> cells with mines are correctly marked 
        and the rest are revealed.</li>
    </ul>

    <MenuButton onClick={onReturn}>Back</MenuButton>
  </div>

export default HowToPlayView