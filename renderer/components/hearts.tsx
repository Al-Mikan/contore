import { Sprite } from '@inlet/react-pixi'

interface Props {
  x: number
  y: number
}

const Heart = ({ x, y }: Props) => {
  return <Sprite image={'/img/heart/full-heart.png'} x={x} y={y} />
}

export default Heart
