import { Sprite } from '@inlet/react-pixi'
import { ReactNode } from 'react'

import { BasicSpriteProps } from '../../types/sprite'
import { containsPointClickThrouth } from '../../utils/PixiAPI'

interface Props extends BasicSpriteProps {
  children: ReactNode
}

const BackGround = ({ x = 0, y = 0, scale = 1, children }: Props) => {
  return (
    <Sprite
      x={x}
      y={y}
      scale={scale}
      image={'/static/img/background.png'} // 1600 × 900
      interactive={true}
      containsPoint={containsPointClickThrouth}
    >
      {children}
    </Sprite>
  )
}

export default BackGround
