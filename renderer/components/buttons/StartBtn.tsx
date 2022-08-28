import { Sprite } from '@inlet/react-pixi'
import { InteractionEvent } from 'pixi.js'
import { useState } from 'react'

interface Props {
  x?: number
  y?: number
  scale?: number
  handleStartClick: (event: InteractionEvent) => void
}

const StartBtn = ({ x = 0, y = 0, scale = 1, handleStartClick }: Props) => {
  const [alpha, setAlpha] = useState(1)
  const mouseover = () => setAlpha(0.8)
  const mouseout = () => setAlpha(1)

  return (
    <Sprite
      image="/img/start-btn.png"
      x={x}
      y={y}
      scale={scale}
      interactive={true}
      alpha={alpha}
      click={handleStartClick}
      mouseover={mouseover}
      mouseout={mouseout}
      buttonMode={true}
    />
  )
}

export default StartBtn
