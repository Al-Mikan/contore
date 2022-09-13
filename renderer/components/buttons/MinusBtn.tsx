import { Sprite } from '@inlet/react-pixi'
import { InteractionEvent } from 'pixi.js'

import { BasicSpriteProps } from '../../types/sprite'

interface Props extends BasicSpriteProps {
  handleClick: (event: InteractionEvent) => void
}

const MinusBtn = ({ x, y, scale = 1, handleClick }: Props) => {
  return (
    <Sprite
      image="/static/img/ShopSelectNum/minus.png"
      x={x}
      y={y}
      scale={scale}
      interactive={true}
      buttonMode={true}
      click={handleClick}
    />
  )
}

export default MinusBtn
