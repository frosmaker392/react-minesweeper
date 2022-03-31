import { ChangeEvent } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'

import '../../styles/utils/IntegerInput.css'

interface IIntegerInputProps {
  id?: string
  className?: string
  range: [min: number, max: number]
  value: number
  setter: (val: number) => void
}

const IntegerInput = ({ id, className, range, value, setter }: IIntegerInputProps) => {
  const [min, max] = [range[0], Math.max(range[0], range[1])]

  const inputChange = 
    (e: ChangeEvent<HTMLInputElement>) => {
      const v = e.target.valueAsNumber
      if (v) setter(v)
    }

  const btnAction = (action: () => void) => 
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      action()
    }

  return (
    <div className={'num-input ' + className}>
      <input
        type='number' id={id}
        value={value} step='1' min={min} max={max}
        onChange={inputChange}
      />

      <button className='sub' 
        tabIndex={-1}
        onClick={btnAction(() => setter(Math.max(min, value - 1)))}> 
        <FontAwesomeIcon icon={faMinus} />
      </button>

      <button className='add' 
        tabIndex={-1}
        onClick={btnAction(() => setter(Math.min(max, value + 1)))}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
    </div>
  )
}

export default IntegerInput