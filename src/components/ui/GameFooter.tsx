import React from 'react'
import { IBoard } from '../../utils/BoardLogic'
import { getDifficulty } from '../../utils/boardPresets'
import capitalizeFirstChar from  '../../utils/capitalizeFirstChar'

import '../../styles/ui/GameFooter.css'

const GameFooter: React.FC<{ boardParams: IBoard }> = 
({ boardParams: bp }) => 
  <footer className='game-footer'>
    <p className='description'>
      { capitalizeFirstChar(getDifficulty(bp)) }
      : ({bp.width}x{bp.height} cells, {bp.numMines} mines)
    </p>
  </footer>

export default GameFooter