import { useEffect, useState } from 'react'

interface Counter {
  plusCount: () => void
  minusCount: () => void
}

const useCounter = (minCount: number, maxCount: number): [number, Counter] => {
  const [count, setCount] = useState(0)
  const plusCount = () => setCount((prev) => Math.min(prev + 1, maxCount))
  const minusCount = () => setCount((prev) => Math.max(prev - 1, minCount))

  return [count, { plusCount, minusCount }]
}

export default useCounter
