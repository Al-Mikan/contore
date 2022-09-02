import { Sprite, Container } from '@inlet/react-pixi'

import { BasicSpriteProps } from '../../types/sprite'

interface Props extends BasicSpriteProps {
  level: number // 1 ~ 100までの数値
}

// levelの数値が不正か判定する責務はLevel.tsxが負う
const Level = ({ x = 0, y = 0, scale = 1, level }: Props) => {
  if (level <= 0 || 100 < level) {
    throw new Error(`範囲外の数値が入力されました => ${level}`)
  }

  const th = Math.floor(level / 1) % 10 // 1桁目
  const se = Math.floor(level / 10) % 10 // 2桁目
  const fi = Math.floor(level / 100) % 10 // 3桁目

  return (
    <Container x={x} y={y} scale={scale}>
      <Sprite image={`img/number/${fi}.png`} x={0} />
      <Sprite image={`img/number/${se}.png`} x={47} />
      <Sprite image={`img/number/${th}.png`} x={100} />
    </Container>
  )
}

export default Level
