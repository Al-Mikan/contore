import { Sprite } from '@inlet/react-pixi'
import { InteractionEvent } from 'pixi.js'
import { useState } from 'react'

import { containsPoint } from '../../utils/PixiAPI'
import { BasicSpriteProps } from '../../types/sprite'

interface Props extends BasicSpriteProps {
  isToggle?: boolean
  name: string
  handleClick: (event: InteractionEvent) => void
}

const Toggle = ({
  x = 0,
  y = 0,
  scale = 1,
  isToggle = false,
  handleClick,
  name,
}: Props) => {
  const [alpha, setAlpha] = useState(1)
  const mouseover = () => setAlpha(0.8)
  const mouseout = () => setAlpha(1)

  /* トグルの下にマウスの動きが伝搬しないようにする */
  return (
    <Sprite
      name={name} // イベント移譲用
      image={
        isToggle ? '/static/img/toggle/on.png' : '/static/img/toggle/off.png'
      }
      x={x}
      y={y}
      scale={scale}
      anchor={0.5}
      click={handleClick}
      interactive={true}
      buttonMode={true}
      alpha={alpha}
      mouseover={mouseover}
      mouseout={mouseout}
      containsPoint={containsPoint}
    />
  )
}

export default Toggle
