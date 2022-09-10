import { Sprite } from '@inlet/react-pixi'

import { BasicSpriteProps } from '../../types/sprite'

interface Props extends BasicSpriteProps {
  n: number
}

const WhiteNum = ({ x = 0, y = 0, scale = 1, n }: Props) => {
  if (n < 0 && 9 < n) throw new Error('0～9以外の数値は表示出来ません')
  return (
    <Sprite image={`/static/img/white-border-number/${n}.png`} x={x} y={y} scale={scale} />
  )
}

export default WhiteNum
