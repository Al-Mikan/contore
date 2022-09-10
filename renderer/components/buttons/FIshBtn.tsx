import { Sprite } from '@inlet/react-pixi'
import { InteractionEvent } from 'pixi.js'
import { useState } from 'react'

import { containsPoint, containsPointClickThrouth } from '../../utils/PixiAPI'
import { BasicSpriteProps } from '../../types/sprite'

interface Props extends BasicSpriteProps {
  isClickThrouth?: boolean
  handleClickFish: (event: InteractionEvent) => void
}

const FishBtn = ({
  x = 0,
  y = 0,
  scale = 1,
  isClickThrouth = false,
  handleClickFish,
}: Props) => {
  const [alpha, setAlpha] = useState(1)
  const mouseover = () => setAlpha(0.8)
  const mouseout = () => setAlpha(1)

  return (
    <Sprite
      image="/static/img/start-btn.png"
      x={x}
      y={y}
      scale={scale}
      interactive={true}
      alpha={alpha}
      mouseover={mouseover}
      mouseout={mouseout}
      containsPoint={isClickThrouth ? containsPointClickThrouth : containsPoint}
      buttonMode={true}
      click={handleClickFish}
    />
  )
}

export default FishBtn
