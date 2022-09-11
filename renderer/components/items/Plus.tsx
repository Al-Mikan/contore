import { Sprite } from '@inlet/react-pixi'
import { InteractionEvent } from 'pixi.js'
import { BasicSpriteProps } from '../../types/sprite'

interface Props extends BasicSpriteProps {
  handleClick:(event: InteractionEvent) => void 
}

const Plus = ({ x, y, scale = 1 ,handleClick}: Props) => {
  return (
    <Sprite
      image="/static/img/ShopSelectNum/plus.png"
      x={x}
      y={y}
      scale={scale}
      alpha={0.7}
      interactive={true}
      click={handleClick}
      mouseover={(e) => {
        e.stopPropagation()
      }}
    />
  )
}

export default Plus
