import { type RefObject, useEffect, useState } from 'react'

// https://stackoverflow.com/questions/43817118/how-to-get-the-width-of-a-react-element
const useElementWidth = (ref: RefObject<HTMLElement>) => {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const getWidth = () => ref.current?.offsetWidth ?? 0
    const handleResize = () => {
      setWidth(getWidth())
    }

    ref.current != null && setWidth(getWidth())
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [ref])

  return width
}

export default useElementWidth
