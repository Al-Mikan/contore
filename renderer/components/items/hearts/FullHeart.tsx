import { Sprite } from '@inlet/react-pixi'
import { HeartProps } from '../../../types/heart'

const Heart = ({ x = 0, y = 0, scale = 1 }: HeartProps) => {
  return <Sprite image="/img/heart/full-heart.png" x={x} y={y} scale={scale} />
}

export default Heart
