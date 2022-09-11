import { Sprite } from '@inlet/react-pixi'
import { InteractionEvent } from 'pixi.js'
import { useState } from 'react'

import { BasicSpriteProps } from '../../types/sprite'
import { containsPoint, containsPointClickThrouth } from '../../utils/PixiAPI'

interface Props extends BasicSpriteProps {
  isClickThrouth?: boolean
  handleStartClick: (event: InteractionEvent) => void
}

const BuyBtn = ({
  x = 0,
  y = 0,
  scale = 1,
  isClickThrouth = false,
  handleStartClick,
}: Props) => {
  const [alpha, setAlpha] = useState(1)
  const mouseover = () => setAlpha(0.8)
  const mouseout = () => setAlpha(1)

  return (
    <Sprite
      image="/static/img/ok-btn.png"
      x={x}
      y={y}
      scale={scale}
      interactive={true}
      alpha={alpha}
      click={handleStartClick}
      mouseover={mouseover}
      mouseout={mouseout}
      containsPoint={isClickThrouth ? containsPointClickThrouth : containsPoint}
      buttonMode={true}
    />
  )
}

export default BuyBtn
