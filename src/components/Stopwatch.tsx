import { useEffect, useState } from "react"

interface IStopwatchProps {
  paused: boolean
}

const Stopwatch = ({ paused }: IStopwatchProps) => {
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

  const secs = String(seconds % 60).padStart(2, "0")
  const mins = String(Math.floor(seconds / 60)).padStart(2, "0")

  return (
    <p>
      {mins}:{secs}
    </p>
  )
}

export default Stopwatch