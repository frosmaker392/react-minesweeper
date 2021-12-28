import { HTMLProps } from "react"

interface IDurationProps extends HTMLProps<HTMLParagraphElement> {
  seconds: number
}

const Duration = (props: IDurationProps) => {
  const { seconds, ...rest } = props

  const secs = seconds % 60
  const mins = Math.floor(seconds / 60)
  const format = (val: number) => String(val).padStart(2, "0")

  return (
    <p {...rest}>
      {format(mins)}:{format(secs)}
    </p>
  )
}

export default Duration