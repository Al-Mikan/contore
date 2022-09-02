import { Sprite } from '@inlet/react-pixi'
import { InteractionEvent } from 'pixi.js'

import { containsPoint } from '../../utils/PixiAPI'
import { BasicSpriteProps } from '../../types/sprite'

interface Props extends BasicSpriteProps {
  handleSettingClick: (event: InteractionEvent) => void
}

const SettingBtn = ({ x = 0, y = 0, scale = 1, handleSettingClick }: Props) => {
  return (
    <Sprite
      image="/img/hamburger.png"
      x={x}
      y={y}
      scale={scale}
      interactive={true}
      click={handleSettingClick}
      buttonMode={true}
      containsPoint={containsPoint}
    />
  )
}

export default SettingBtn
