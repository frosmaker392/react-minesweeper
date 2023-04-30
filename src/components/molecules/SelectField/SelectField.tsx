import React, { type ChangeEventHandler, type PropsWithChildren } from 'react'
import { Select } from '../../atoms'

import clickableClasses from '../../atoms/Clickable.module.css'
import fieldClasses from '../Field.module.css'

export interface SelectFieldProps<T extends string> {
  id: string
  value: T
  options: readonly T[]
  onChange: (value: T) => void
  renderOption: (value: T) => JSX.Element
}

const SelectField = <T extends string>(
  props: PropsWithChildren<SelectFieldProps<T>>
) => {
  const { id, value, options, onChange, renderOption, children } = props
  const onOptionChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
    const value = e.target.value as T
    onChange(value)
  }

  return (
    <>
      <label htmlFor={id} data-testid="select-field-label">
        {children}
      </label>
      <Select
        className={`${clickableClasses.clickable} ${fieldClasses.field}`}
        id={id}
        value={value}
        onChange={onOptionChange}
      >
        {options.map(renderOption)}
      </Select>
    </>
  )
}

export default SelectField
