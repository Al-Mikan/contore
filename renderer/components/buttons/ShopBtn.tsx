import { InteractionEvent } from 'pixi.js'

import { BasicSpriteProps } from '../../types/sprite'
import ButtonTemplate from './template/ButtonTemplate'

interface Props extends BasicSpriteProps {
  isClickThrouth?: boolean
  handleClick: (event: InteractionEvent) => void
}

const ShopBtn = ({
  x = 0,
  y = 0,
  scale = 1,
  isClickThrouth = false,
  handleClick,
}: Props) => {
  return (
    <ButtonTemplate
      image="/static/img/shop-btn.png"
      x={x}
      y={y}
      scale={scale}
      handleClick={handleClick}
      isClickThrouth={isClickThrouth}
    />
  )
}

export default ShopBtn
