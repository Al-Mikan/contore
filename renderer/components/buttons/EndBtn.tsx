import { Sprite } from '@inlet/react-pixi'
import { InteractionEvent } from 'pixi.js'
import { useState } from 'react'

import { containsPoint } from '../../utils/pixi_api'

interface Props {
  x?: number
  y?: number
  scale?: number
  handleStopClick: (event: InteractionEvent) => void
}

const EndBtn = ({ x = 0, y = 0, scale = 1, handleStopClick }: Props) => {
  const [alpha, setAlpha] = useState(1)
  const mouseover = () => setAlpha(0.8)
  const mouseout = () => setAlpha(1)

  return (
    <Sprite
      image="/img/end-btn.png"
      x={x}
      y={y}
      scale={scale}
      interactive={true}
      alpha={alpha}
      click={handleStopClick}
      mouseover={mouseover}
      mouseout={mouseout}
      containsPoint={containsPoint}
    />
  )
}

export default EndBtn
