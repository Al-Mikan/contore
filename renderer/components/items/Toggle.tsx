import { Sprite } from '@inlet/react-pixi'
import { InteractionEvent } from 'pixi.js'
import { containsPointClickThrouth } from '../../utils/pixi_api'
import { useState } from 'react'

interface Props {
  x?: number
  y?: number
  scale?: number
  isToggle?: boolean
  handleClick: (event: InteractionEvent) => void
}

const Toggle = ({
  x = 0,
  y = 0,
  scale = 1,
  isToggle = false,
  handleClick,
}: Props) => {
  const [alpha, setAlpha] = useState(1)
  const mouseover = () => setAlpha(0.8)
  const mouseout = () => setAlpha(1)
  return (
    <Sprite
      image={isToggle ? '/img/toggle/on.png' : '/img/toggle/off.png'}
      x={x}
      y={y}
      scale={scale}
      click={handleClick}
      interactive={true}
      alpha={alpha}
      mouseover={mouseover}
      mouseout={mouseout}
      buttonMode={true}
      containsPoint={containsPointClickThrouth}
    />
  )
}

export default Toggle
