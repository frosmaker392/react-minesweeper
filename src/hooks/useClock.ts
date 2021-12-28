import { MutableRefObject, useRef, useState } from "react"

const useClock = (tickDuration = 100) => {
  const [lastTickMs, setLastTickMs] = useState(Date.now())
  const countRef: MutableRefObject<NodeJS.Timeout | undefined> = 
    useRef(undefined)

  const startClock = (onTick: (tickMs: number) => void) => {
    countRef.current = setInterval(() => {
      const now = Date.now()
      const delta = now - lastTickMs
      onTick(delta)
      setLastTickMs(now)
    }, tickDuration)
  }

  const stopClock = () => {
    clearInterval(countRef.current as number | undefined)
  }

  return { startClock, stopClock }
}

export default useClock