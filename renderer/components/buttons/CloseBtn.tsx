import { Sprite } from '@inlet/react-pixi'
import { InteractionEvent } from 'pixi.js'

import useHover from '../../hooks/useHover'
import { BasicSpriteProps } from '../../types/sprite'
import { containsPoint, containsPointClickThrouth } from '../../utils/PixiAPI'

interface Props extends BasicSpriteProps {
  isClickThrouth?: boolean
  handleClick: (event: InteractionEvent) => void
}

const CloseBtn = ({
  x = 0,
  y = 0,
  scale = 1,
  isClickThrouth = false,
  handleClick,
}: Props) => {
  const [alpha, { mouseOver, mouseOut }] = useHover()

  return (
    <Sprite
      image="/static/img/close.png"
      x={x}
      y={y}
      scale={scale}
      interactive={true}
      buttonMode={true}
      alpha={alpha}
      click={handleClick}
      mouseover={mouseOver}
      mouseout={mouseOut}
      containsPoint={isClickThrouth ? containsPointClickThrouth : containsPoint}
    />
  )
}

export default CloseBtn
