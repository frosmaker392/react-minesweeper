import { HTMLProps, useEffect } from "react"

interface IStopwatchProps extends HTMLProps<HTMLParagraphElement> {
  paused: boolean
  seconds: number
  onUpdateSeconds: (secsSinceLastPause: number) => void
}

const Stopwatch = (props: IStopwatchProps) => {
  const { paused, seconds, onUpdateSeconds, ...rest } = props

  useEffect(() => {
    if (!paused) {
      const start = Date.now()
      const interval = setInterval(
        () => {
          const delta = Date.now() - start
          onUpdateSeconds(Math.floor(delta / 1000))
        }, 100)

      return () => { clearInterval(interval) }
    }
  }, [paused, onUpdateSeconds])

  const secs = seconds % 60
  const mins = Math.floor(seconds / 60)
  const format = (val: number) => String(val).padStart(2, "0")

  return (
    <p {...rest}>
      {format(mins)}:{format(secs)}
    </p>
  )
}

export default Stopwatch