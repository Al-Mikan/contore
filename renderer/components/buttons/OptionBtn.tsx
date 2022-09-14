import { InteractionEvent } from 'pixi.js'

import { BasicSpriteProps } from '../../types/sprite'
import ButtonTemplate from './template/ButtonTemplate'

interface Props extends BasicSpriteProps {
  handleClick: (event: InteractionEvent) => void
}

const OptionBtn = ({ x = 0, y = 0, scale = 1, handleClick }: Props) => {
  return (
    <ButtonTemplate
      image="/static/img/option-btn.png"
      x={x}
      y={y}
      scale={scale}
      handleClick={handleClick}
    />
  )
}

export default OptionBtn
