import { InteractionEvent } from 'pixi.js'
import { useState } from 'react'

interface HoverHandler {
  mouseOver: (e: InteractionEvent) => void
  mouseOut: (e: InteractionEvent) => void
}

const useHover = (): [number, HoverHandler] => {
  const [alpha, setAlpha] = useState(1)
  const mouseOver = () => setAlpha(0.8)
  const mouseOut = () => setAlpha(1)

  return [alpha, { mouseOver, mouseOut }]
}

export default useHover
