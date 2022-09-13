import { InteractionEvent } from 'pixi.js'

import { BasicSpriteProps } from '../../types/sprite'
import ButtonTemplate from './template/ButtonTemplate'

interface Props extends BasicSpriteProps {
  isClickThrouth?: boolean
  isZero: boolean
  handleClick: (event: InteractionEvent) => void
}

const FishBtn = ({
  x = 0,
  y = 0,
  scale = 1,
  isClickThrouth = false,
  isZero = false,
  handleClick,
}: Props) => {
  return (
    <>
      {isZero ? (
        <ButtonTemplate
          image="/static/img/cant-give-btn.png"
          x={x}
          y={y}
          scale={scale}
          handleClick={handleClick}
          isClickThrouth={isClickThrouth}
        />
      ) : (
        <ButtonTemplate
          image="/static/img/give-btn.png"
          x={x}
          y={y}
          scale={scale}
          handleClick={handleClick}
          isClickThrouth={isClickThrouth}
        />
      )}
    </>
  )
}

export default FishBtn
