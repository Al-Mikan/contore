import { Sprite } from '@inlet/react-pixi'
import { InteractionEvent } from 'pixi.js'
import { useState } from 'react'

interface Props {
  handleStartClick: (event: InteractionEvent) => void
}

const StartBtn = ({ handleStartClick }: Props) => {
  const [alpha, setAlpha] = useState(1)
  const mouseover = () => setAlpha(0.8)
  const mouseout = () => setAlpha(1)

  return (
    <Sprite
      image="/img/start-btn.png"
      x={1600}
      y={900}
      scale={2}
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
