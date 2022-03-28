import { ButtonHTMLAttributes } from "react"

const MenuButton = (props: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return <button className="clickable" {...props}> 
    {props.children} 
  </button>
}

export default MenuButton