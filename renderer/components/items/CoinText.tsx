import { Sprite, Container } from '@inlet/react-pixi'

import { BasicSpriteProps } from '../../types/sprite'

interface Props extends BasicSpriteProps {
  n: number // 0 ~ 9999までの数値
}

const Level = ({ x = 0, y = 0, scale = 1, n }: Props) => {
  if (n < 0 || 9999 < n) {
    throw new Error(`範囲外の数値が入力されました => ${n}`)
  }

  const forth = Math.floor(n / 1) % 10 // 1桁目
  const third = Math.floor(n / 10) % 10 // 2桁目
  const second = Math.floor(n / 100) % 10 // 3桁目
  const first = Math.floor(n / 1000) % 10 // 4桁目

  return (
    <Container x={x} y={y} scale={scale}>
      <Sprite image={`img/number/${first}.png`} x={0} />
      <Sprite image={`img/number/${second}.png`} x={47} />
      <Sprite image={`img/number/${third}.png`} x={100} />
      <Sprite image={`img/number/${forth}.png`} x={150} />
    </Container>
  )
}

export default Level
