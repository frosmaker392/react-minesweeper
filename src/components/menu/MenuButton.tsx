import { ButtonHTMLAttributes } from "react"

const MenuButton = ({ className, ...restOfProps}: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return <button className={'clickable ' + className ?? ''} {...restOfProps}> 
    {restOfProps.children} 
  </button>
}

export default MenuButton