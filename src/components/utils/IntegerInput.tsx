import { useEffect, useState } from "react"
import "../../styles/utils/IntegerInput.css"

interface IIntegerInputProps {
  id?: string
  className?: string
  range: [min: number, max: number]
  value: number
  onChange: (val: number) => void
}

const IntegerInput = ({ id, className, range, value, onChange }: IIntegerInputProps) => {
  const [min, max] = [range[0], Math.max(range[0], range[1])]

  const [val, setVal] = useState(value)

  useEffect(() => {
    onChange(val)
  }, [val, onChange])

  return (
    <div className={"num-input " + className}>
      <input
        type="number" id={id}
        value={val} step="1" min={min} max={max}
        onChange={(e) => {
          console.log(e.target.value)
          const value = parseInt(e.target.value)
          if (value)
            setVal(value)
        }}
      />

      <button className="sub" 
        tabIndex={-1}
        onClick={(e) => {
          e.preventDefault()
          setVal(Math.max(min, val - 1))
        }}> - </button>

      <button className="add" 
        tabIndex={-1}
        onClick={(e) => {
          e.preventDefault()
          setVal(Math.min(max, val + 1))
        }}> + </button>
    </div>
  )
}

export default IntegerInput