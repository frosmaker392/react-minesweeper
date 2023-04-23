import React, { type ChangeEvent } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'

import classes from './IntegerInput.module.css'

interface Props {
  id?: string
  className?: string
  range: [min: number, max: number]
  value: number
  onChange: (value: number) => void
}

const IntegerInput: React.FC<Props> = ({
  id,
  className,
  range,
  value,
  onChange,
}) => {
  const [min, max] = [range[0], Math.max(range[0], range[1])]

  const inputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const v = e.target.valueAsNumber
    if (!isNaN(v)) onChange(v)
  }

  const createOnClick =
    (value: number) => (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      onChange(value)
    }

  return (
    <div className={`${classes.numInput} ${className ?? ''}`}>
      <input
        type="number"
        id={id}
        value={value}
        step="1"
        min={min}
        max={max}
        onChange={inputChange}
      />

      <button
        className={classes.subtractButton}
        tabIndex={-1}
        onClick={createOnClick(Math.max(min, value - 1))}
      >
        <FontAwesomeIcon icon={faMinus} />
      </button>

      <button
        className={classes.addButton}
        tabIndex={-1}
        onClick={createOnClick(Math.min(max, value + 1))}
      >
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </div>
  )
}

export default IntegerInput
