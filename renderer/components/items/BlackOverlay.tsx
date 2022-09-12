import { Container, Sprite } from '@inlet/react-pixi'
import { InteractionEvent } from 'pixi.js'
import { ReactNode } from 'react'

import { BasicSpriteProps } from '../../types/sprite'
import { containsPointClickThrouth } from '../../utils/PixiAPI'

interface Props extends BasicSpriteProps {
  children: ReactNode
}

const BlackOverlay = ({ x = 0, y = 0, scale = 1, children }: Props) => {
  return (
    <>
      <Sprite
        image="/static/img/black.png"
        x={x}
        y={y}
        scale={scale}
        alpha={0.7}
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
      ></Sprite>
      {children}
    </>
  )
}

export default BlackOverlay
