import { CellState, ICell } from '../utils/BoardLogic'

import { ReactComponent as FlagIcon } from '../icons/Flag.svg'
import { ReactComponent as MineIcon } from '../icons/Mine.svg'

import "../styles/Cell.css"

interface ILowerProps {
  cellParams: Pick<ICell, 'state' | 'hasMine' | 'neighboringMines'>
  className: string
}

interface IUpperProps {
  cellParams: Pick<ICell, 'state' | 'hasMine'>
  revealMine: boolean
  className: string
}

interface ICellProps {
  cellParams: ICell
  revealMine: boolean
  fontSize: number
  onClick: () => void
  onRightClick: () => void
}

const Lower = ({ cellParams, className }: ILowerProps) => {
  const { state, hasMine, neighboringMines: nMines } 
    = cellParams;

  return state === 'revealed' ?
    (hasMine ? 
      <MineIcon className={className + ' with-mine'} /> 
      : <div className={className}>{nMines > 0 ? nMines : ""}</div>)
    : <div className={className} />
}
  
const Upper = ({ cellParams, revealMine, className }: IUpperProps) => {
  const { state, hasMine } = cellParams

  const upperElements: Record<CellState, JSX.Element> = {
    hidden    : (revealMine && hasMine ? 
                <MineIcon className={className + ' with-mine'} /> 
                : <div className={className} />),
    revealed  : <></>,
    flagged   : <FlagIcon className={className} />,
    unknown   : <div className={className} >?</div>
  }

  return upperElements[state]
}

const Cell = (props: ICellProps) => {
  const { state } = props.cellParams
  const { revealMine, fontSize, onClick, onRightClick } = props

  return (
    <div 
      onClick={onClick}
      onContextMenu={(e) => {
        e.preventDefault()
        onRightClick()
      }}
      style={{fontSize}}
      className={"boardCell unselectable " + state}>
        <Lower cellParams={props.cellParams} className='lower'  />
        {state !== "revealed" && <div className='shadow' />}
        <Upper cellParams={props.cellParams} revealMine={revealMine} 
          className='upper' />
    </div>
  )
};

export default Cell