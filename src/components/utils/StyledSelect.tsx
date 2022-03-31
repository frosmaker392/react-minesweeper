import { HTMLProps } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'

import '../../styles/utils/StyledSelect.css'

interface IStyledSelectProps extends HTMLProps<HTMLSelectElement> { }

const StyledSelect = (props: IStyledSelectProps) => {
  return (
    <div className={ props.className } >
      <select { ...props } className='select' >
        { props.children }
      </select>
      <FontAwesomeIcon icon={ faCaretDown } className='arrow' />
    </div>
  )
}

export default StyledSelect