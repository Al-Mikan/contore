import { Sprite } from '@inlet/react-pixi'
import { ReactNode } from 'react'

import { BasicSpriteProps } from '../../types/sprite'
import { containsPointClickThrouth } from '../../utils/PixiAPI'

interface Props extends BasicSpriteProps {
  children: ReactNode
  width: number
  height: number
}

const BackGround = ({ children, width, height }: Props) => {
  return (
    <Sprite
      image={'/static/img/background.png'} // 1600 × 900
      width={width}
      height={height}
      interactive={true}
      containsPoint={containsPointClickThrouth}
    >
      {children}
    </Sprite>
  )
}

export default BackGround
