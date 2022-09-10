import { Sprite } from '@inlet/react-pixi'
import { InteractionEvent } from 'pixi.js'
import { containsPointClickThrouth } from '../../utils/PixiAPI'

import { BasicSpriteProps } from '../../types/sprite'

interface Props extends BasicSpriteProps {}

const Black = ({ x, y, scale = 1 }: Props) => {
  return (
    <Sprite
      image="/static/img/black.png"
      x={0}
      y={-39}
      scale={scale}
      alpha={0.7}
      width={1280}
      height={720}
      interactive={true}
      containsPoint={containsPointClickThrouth}
      click={(e: InteractionEvent) => {
        e.stopPropagation()
      }}
      mousedown={(e) => {
        e.stopPropagation()
      }}
      mousemove={(e) => {
        e.stopPropagation()
      }}
      mouseup={(e) => {
        e.stopPropagation()
      }}
      mouseout={(e) => {
        e.stopPropagation()
      }}
      mouseover={(e) => {
        e.stopPropagation()
      }}
      mouseupoutside={(e) => {
        e.stopPropagation()
      }}
    />
  )
}

export default Black
