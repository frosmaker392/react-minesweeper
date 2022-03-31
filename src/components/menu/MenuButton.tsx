import React, { ButtonHTMLAttributes } from 'react'

const MenuButton: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = 
({ className, ...restOfProps }) => 
  <button className={'clickable ' + className ?? ''} {...restOfProps}> 
    {restOfProps.children} 
  </button>

export default MenuButton