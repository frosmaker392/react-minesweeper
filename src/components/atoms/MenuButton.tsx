import React, { type ButtonHTMLAttributes } from 'react'

const MenuButton: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  className,
  children,
  ...restOfProps
}) => (
  <button className={`clickable ${className ?? ''}`} {...restOfProps}>
    {children}
  </button>
)

export default MenuButton
