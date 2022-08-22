import { Sprite } from '@inlet/react-pixi'
import { InteractionEvent } from 'pixi.js'
import { useState } from 'react'

import { containsPoint } from '../utils/pixi_api'

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
      x={1800}
      y={1000}
      scale={1}
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
