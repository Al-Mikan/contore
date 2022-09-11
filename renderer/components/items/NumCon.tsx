import { Sprite } from '@inlet/react-pixi'
import { InteractionEvent } from 'pixi.js'
import { BasicSpriteProps } from '../../types/sprite'

interface Props extends BasicSpriteProps {}

const NumCon = ({ x, y, scale = 1 }: Props) => {
  return (
    <Sprite
      image="/static/img/ShopSelectNum/numcon.png"
      x={x}
      y={y}
      scale={scale}
      alpha={0.7}
      interactive={true}
      click={(e: InteractionEvent) => {
        e.stopPropagation()
      }}
      mouseover={(e) => {
        e.stopPropagation()
      }}
    />
  )
}

export default NumCon
