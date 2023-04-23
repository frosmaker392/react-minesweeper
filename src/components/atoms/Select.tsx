import React, { type HTMLProps } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'

import classes from './Select.module.css'

const Select: React.FC<HTMLProps<HTMLSelectElement>> = (props) => (
  <div className={props.className}>
    <select {...props} className={classes.select}>
      {props.children}
    </select>
    <FontAwesomeIcon icon={faCaretDown} className={classes.arrow} />
  </div>
)

export default Select
