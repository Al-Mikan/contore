import { Sprite } from '@inlet/react-pixi'

import { BasicSpriteProps } from '../../types/sprite'

interface Props extends BasicSpriteProps {}

const Fish = ({ x = 0, y = 0, scale = 1 }: Props) => {
  return <Sprite image="/img/fish.png" anchor={0.5} x={x} y={y} scale={scale} />
}

export default Fish
