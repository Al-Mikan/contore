import { Sprite } from '@inlet/react-pixi'

interface Props {
  n: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 // 10段階で経験値バーを変える
}

const LevelBar = ({ n }: Props) => {
  return <Sprite image={`/img/level-bars/${n}.png`} x={1500} y={80} scale={2} />
}

export default LevelBar
