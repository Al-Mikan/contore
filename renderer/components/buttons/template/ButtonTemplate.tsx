import { Sprite } from '@inlet/react-pixi'
import { InteractionEvent } from 'pixi.js'

import useHover from '../../../hooks/useHover'
import { BasicSpriteProps } from '../../../types/sprite'
import {
  containsPoint,
  containsPointClickThrouth,
} from '../../../utils/PixiAPI'

interface Props extends BasicSpriteProps {
  image: string
  isClickThrouth?: boolean
  handleClick: (event: InteractionEvent) => void
}

const ButtonTemplate = ({
  x = 0,
  y = 0,
  scale = 1,
  isClickThrouth = false,
  image,
  handleClick,
}: Props) => {
  const [alpha, { mouseOver, mouseOut }] = useHover()

  return (
    <Sprite
      image={image}
      x={x}
      y={y}
      scale={scale}
      click={handleClick}
      alpha={alpha}
      interactive={true}
      mouseover={mouseOver}
      mouseout={mouseOut}
      containsPoint={isClickThrouth ? containsPointClickThrouth : containsPoint}
      buttonMode={true}
    />
  )
}

export default ButtonTemplate
