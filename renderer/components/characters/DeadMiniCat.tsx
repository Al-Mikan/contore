import { Sprite } from '@inlet/react-pixi'

import { BasicSpriteProps } from '../../types/sprite'
import { containsPoint, containsPointClickThrouth } from '../../utils/PixiAPI'

interface Props extends BasicSpriteProps {
  isClickThrouth?: boolean
}

const DeadMiniCat = ({
  x = 0,
  y = 0,
  scale = 1,
  isClickThrouth = false,
}: Props) => {
  return (
    <Sprite
      image="/static/img/mini-cat/death.png"
      x={x}
      y={y}
      scale={scale}
      anchor={0.5}
      containsPoint={isClickThrouth ? containsPointClickThrouth : containsPoint}
      buttonMode={true}
      interactive={true}
    />
  )
}

export default DeadMiniCat
