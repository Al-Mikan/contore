import { Sprite } from '@inlet/react-pixi'

import { BasicSpriteProps } from '../../types/sprite'

interface Props extends BasicSpriteProps {
  n: number // 0～10段階で経験値バーを変える
}

const LevelBar = ({ x = 0, y = 0, scale = 1, n }: Props) => {
  if (n < 0 || 10 < n) {
    throw new Error(`範囲外の数値が入力されました => ${n}`)
  }
  return (
    <Sprite
      image={`/static/img/level-bars/${n}.png`}
      x={x}
      y={y}
      scale={scale}
    />
  )
}

export default LevelBar
