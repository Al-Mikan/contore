import { Sprite } from '@inlet/react-pixi'

import { BasicSpriteProps } from '../../types/sprite'

interface Props extends BasicSpriteProps {
  n: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 // 10段階で経験値バーを変える
}

const LevelBar = ({ x = 0, y = 0, scale = 1, n }: Props) => {
  return <Sprite image={`/img/level-bars/${n}.png`} x={x} y={y} scale={scale} />
}

export default LevelBar
