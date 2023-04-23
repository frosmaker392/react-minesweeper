import React, { type ChangeEventHandler, type PropsWithChildren } from 'react'
import Select from '../atoms/Select'

import clickableClasses from '../atoms/Clickable.module.css'
import fieldClasses from './Field.module.css'

interface Props<T extends string> {
  id: string
  value: T
  options: T[]
  onOptionChange: (value: T) => void
  renderOption: (value: T) => JSX.Element
}

const SelectField = <T extends string>(props: PropsWithChildren<Props<T>>) => {
  const { id, value, options, onOptionChange, renderOption, children } = props
  const onChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
    const value = e.target.value as T
    onOptionChange(value)
  }

  return (
    <>
      <label htmlFor={id}>{children}</label>
      <Select
        className={`${clickableClasses.clickable} ${fieldClasses.field}`}
        id={id}
        value={value}
        onChange={onChange}
      >
        {options.map(renderOption)}
      </Select>
    </>
  )
}

export default SelectField
