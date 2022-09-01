import { Sprite } from '@inlet/react-pixi'

interface Props {
  x?: number
  y?: number
  scale?: number
  n: number
}

const Num = ({ x = 0, y = 0, scale = 1, n }: Props) => {
  if (n < 0 && 9 < n) throw new Error('0～9以外の数値は表示出来ません')
  return <Sprite image={`/img/number/${n}.png`} x={x} y={y} scale={scale} />
}

export default Num
