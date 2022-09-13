import { Sprite } from '@inlet/react-pixi'
import { InteractionEvent } from 'pixi.js'
import { ReactNode } from 'react'

import { BasicSpriteProps } from '../../types/sprite'

interface Props extends BasicSpriteProps {
  children: ReactNode
}

const NumBox = ({ x, y, scale = 1, children }: Props) => {
  return (
    <Sprite
      image="/static/img/ShopSelectNum/numcon.png"
      x={x}
      y={y}
      scale={scale}
    >
      {children}
    </Sprite>
  )
}

export default NumBox
