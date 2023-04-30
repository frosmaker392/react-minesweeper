import React, { type HTMLProps } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'

import classes from './Select.module.css'

const Select: React.FC<HTMLProps<HTMLSelectElement>> = (props) => (
  <div className={props.className} data-testid="select-container">
    <select {...props} className={classes.select} data-testid="select">
      {props.children}
    </select>
    <FontAwesomeIcon icon={faCaretDown} className={classes.arrow} />
  </div>
)

export default Select
