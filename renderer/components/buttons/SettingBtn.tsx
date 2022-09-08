import { Sprite } from '@inlet/react-pixi'
import { InteractionEvent } from 'pixi.js'
import { useState } from 'react'

import { containsPoint } from '../../utils/PixiAPI'
import { BasicSpriteProps } from '../../types/sprite'

interface Props extends BasicSpriteProps {
  handleSettingClick: (event: InteractionEvent) => void
}

const SettingBtn = ({ x = 0, y = 0, scale = 1, handleSettingClick }: Props) => {
  const [alpha, setAlpha] = useState(1)
  const mouseover = () => setAlpha(0.8)
  const mouseout = () => setAlpha(1)
  return (
    <Sprite
      image="/static/img/hamburger.png"
      x={x}
      y={y}
      scale={scale}
      interactive={true}
      click={handleSettingClick}
      buttonMode={true}
      mouseover={mouseover}
      mouseout={mouseout}
      alpha={alpha}
      containsPoint={containsPoint}
    />
  )
}

export default SettingBtn
