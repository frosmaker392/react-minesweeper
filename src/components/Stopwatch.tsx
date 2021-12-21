import { HTMLProps, useEffect, useState } from "react"

interface IStopwatchProps extends HTMLProps<HTMLTimeElement> {
  paused: boolean
}

const Stopwatch = (props: IStopwatchProps) => {
  const { paused } = props
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    if (!paused) {
      const start = Date.now()
      const initSeconds = seconds

      const interval = setInterval(() => {
        const delta = Date.now() - start
        setSeconds(initSeconds + Math.floor(delta / 1000))
      }, 100)
      return () => { clearInterval(interval) }
    }
  }, [paused, seconds])

  const secs = seconds % 60
  const mins = Math.floor(seconds / 60)

  const format = (val: number) => String(val).padStart(2, "0")

  return (
    <time {...{...props, dateTime: `${mins}m ${secs}s`}}>
      {format(mins)}:{format(secs)}
    </time>
  )
}

export default Stopwatch