import { Sprite } from '@inlet/react-pixi'

interface Props {
  x?: number
  y?: number
  scale?: number
}

const Heart = ({ x = 0, y = 0, scale = 1 }: Props) => {
  return (
    <Sprite image={'/img/heart/full-heart.png'} x={x} y={y} scale={scale} />
  )
}

export default Heart
