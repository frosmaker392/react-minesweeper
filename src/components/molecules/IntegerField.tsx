import React, { type FC } from 'react'
import { IntegerInput } from '../atoms'

import clickableClasses from '../atoms/Clickable.module.css'
import fieldClasses from './Field.module.css'

interface Props {
  id: string
  value: number
  min: number
  max: number
  onChange: (value: number) => void
}

const IntegerField: FC<Props> = ({
  id,
  value,
  min,
  max,
  onChange,
  children,
}) => (
  <>
    <label htmlFor={id}>{children}</label>
    <IntegerInput
      className={`${clickableClasses.clickable} ${fieldClasses.field}`}
      id={id}
      value={value}
      min={min}
      max={max}
      onChange={onChange}
    />
  </>
)

export default IntegerField
