import React, { type FC } from 'react'
import IntegerInput from '../atoms/IntegerInput'

import clickableClasses from '../atoms/Clickable.module.css'
import fieldClasses from './Field.module.css'

interface Props {
  id: string
  value: number
  range: [number, number]
  onChange: (value: number) => void
}

const IntegerField: FC<Props> = ({ id, value, range, onChange, children }) => (
  <>
    <label htmlFor={id}>{children}</label>
    <IntegerInput
      className={`${clickableClasses.clickable} ${fieldClasses.field}`}
      id={id}
      value={value}
      range={range}
      onChange={onChange}
    />
  </>
)

export default IntegerField
