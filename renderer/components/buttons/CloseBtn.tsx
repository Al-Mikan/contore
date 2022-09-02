import { Sprite } from '@inlet/react-pixi'
import { InteractionEvent } from 'pixi.js'
import { useState } from 'react'

import { containsPoint } from '../../utils/PixiAPI'
import { BasicSpriteProps } from '../../types/sprite'

interface Props extends BasicSpriteProps {
  handleClick: (event: InteractionEvent) => void
}

const CloseBtn = ({ x = 0, y = 0, scale = 1, handleClick }: Props) => {
  const [alpha, setAlpha] = useState(1)
  const mouseover = () => setAlpha(0.8)
  const mouseout = () => setAlpha(1)

  return (
    <Sprite
      image="/img/close.png"
      x={x}
      y={y}
      scale={scale}
      interactive={true}
      alpha={alpha}
      click={handleClick}
      mouseover={mouseover}
      mouseout={mouseout}
      buttonMode={true}
      containsPoint={containsPoint}
    />
  )
}

export default CloseBtn
