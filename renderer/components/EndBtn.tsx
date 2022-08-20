import { Sprite } from '@inlet/react-pixi'
import { InteractionEvent } from 'pixi.js'
import { useState } from 'react'

interface Props {
  handleStopClick: (event: InteractionEvent) => void
}

const EndBtn = ({ handleStopClick }: Props) => {
  const [alpha, setAlpha] = useState(1)
  const mouseover = () => setAlpha(0.8)
  const mouseout = () => setAlpha(1)

  return (
    <Sprite
      image="/img/end-btn.png"
      x={1600}
      y={900}
      scale={3}
      interactive={true}
      alpha={alpha}
      click={handleStopClick}
      mouseover={mouseover}
      mouseout={mouseout}
    />
  )
}

export default EndBtn
