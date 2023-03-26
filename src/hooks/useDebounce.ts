import { useEffect, useState } from 'react'

const useDebounce = <T>(updateIntervalMs: number, value: T) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, updateIntervalMs)

    return () => {
      clearTimeout(timer)
    }
  }, [value, updateIntervalMs])

  return debouncedValue
}

export default useDebounce
