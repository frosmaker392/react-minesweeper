import React, { type MouseEventHandler, type ChangeEventHandler } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'

import classes from './IntegerInput.module.css'

interface Props {
  id?: string
  className?: string
  min: number
  max: number
  value: number
  onChange: (value: number) => void
}

const IntegerInput: React.FC<Props> = ({
  id,
  className,
  min,
  max,
  value,
  onChange,
}) => {
  const newMax = Math.max(min, max)

  const guardedOnChange = (newValue: number) => {
    if (!isNaN(newValue)) onChange(newValue)
  }

  const inputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.valueAsNumber
    guardedOnChange(value)
  }

  const onDecrement: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()
    guardedOnChange(Math.min(max, value - 1))
  }

  const onIncrement: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()
    guardedOnChange(Math.min(max, value + 1))
  }

  return (
    <div
      className={`${classes.numInput} ${className ?? ''}`}
      data-testid="integer-input-container"
    >
      <input
        type="number"
        id={id}
        value={value}
        step={1}
        min={min}
        max={newMax}
        onChange={inputChange}
        data-testid="integer-input"
      />

      <button
        className={classes.decrementButton}
        tabIndex={-1}
        onClick={onDecrement}
        data-testid="decrement-button"
      >
        <FontAwesomeIcon icon={faMinus} />
      </button>

      <button
        className={classes.incrementButton}
        tabIndex={-1}
        onClick={onIncrement}
        data-testid="increment-button"
      >
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </div>
  )
}

export default IntegerInput
