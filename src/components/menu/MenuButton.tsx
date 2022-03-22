import { ButtonHTMLAttributes } from "react"

const MenuButton = (props: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return <button className="focusable" {...props}> 
    {props.children} 
  </button>
}

export default MenuButton