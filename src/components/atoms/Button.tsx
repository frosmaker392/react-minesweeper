import React, { type ButtonHTMLAttributes } from 'react'

import classes from './Clickable.module.css'

const Button: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  className,
  children,
  ...restOfProps
}) => (
  <button
    className={`${classes.clickable} ${className ?? ''}`}
    {...restOfProps}
  >
    {children}
  </button>
)

export default Button
