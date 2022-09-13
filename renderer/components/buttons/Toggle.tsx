import { Sprite } from '@inlet/react-pixi'
import { InteractionEvent } from 'pixi.js'

import useHover from '../../hooks/useHover'
import { BasicSpriteProps } from '../../types/sprite'
import { containsPoint } from '../../utils/PixiAPI'

interface Props extends BasicSpriteProps {
  isOn: boolean
  name: string
  handleClick: (event: InteractionEvent) => void
}

const Toggle = ({
  x = 0,
  y = 0,
  scale = 1,
  isOn = false,
  handleClick,
  name,
}: Props) => {
  const [alpha, { mouseOut, mouseOver }] = useHover()

  /* トグルの下にマウスの動きが伝搬しないようにする */
  return (
    <Sprite
      name={name} // イベント移譲用
      image={isOn ? '/static/img/toggle/on.png' : '/static/img/toggle/off.png'}
      x={x}
      y={y}
      scale={scale}
      anchor={0.5}
      click={handleClick}
      interactive={true}
      buttonMode={true}
      alpha={alpha}
      mouseover={mouseOver}
      mouseout={mouseOut}
      containsPoint={containsPoint}
    />
  )
}

export default Toggle
