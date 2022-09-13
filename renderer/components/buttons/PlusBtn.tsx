import { InteractionEvent } from 'pixi.js'

import { BasicSpriteProps } from '../../types/sprite'
import ButtonTemplate from './template/ButtonTemplate'

interface Props extends BasicSpriteProps {
  handleClick: (event: InteractionEvent) => void
}

const PlusBtn = ({ x, y, scale = 1, handleClick }: Props) => {
  return (
    <ButtonTemplate
      image="/static/img/ShopSelectNum/plus.png"
      x={x}
      y={y}
      scale={scale}
      handleClick={handleClick}
    />
  )
}

export default PlusBtn
