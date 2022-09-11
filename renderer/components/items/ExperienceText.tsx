import { Container, Sprite } from '@inlet/react-pixi'

import { BasicSpriteProps } from '../../types/sprite'

interface Props extends BasicSpriteProps {
  n: number // 0 ~ 9999までの数値
}

const Level = ({ x = 0, y = 0, scale = 1, n }: Props) => {
  if (n < 0 || 99999 < n) {
    throw new Error(`範囲外の数値が入力されました => ${n}`)
  }

  const first = Math.floor(n / 1) % 10 // 1桁目
  const second = Math.floor(n / 10) % 10 // 2桁目
  const third = Math.floor(n / 100) % 10 // 3桁目
  const forth = Math.floor(n / 1000) % 10 // 4桁目
  const fifth = Math.floor(n / 10000) % 10 // 5桁目

  return (
    <Container x={x} y={y} scale={scale}>
      <Sprite image={`/static/img/number/${fifth}.png`} x={0} />
      <Sprite image={`/static/img/number/${forth}.png`} x={50} />
      <Sprite image={`/static/img/number/${third}.png`} x={100} />
      <Sprite image={`/static/img/number/${second}.png`} x={150} />
      <Sprite image={`/static/img/number/${first}.png`} x={200} />
    </Container>
  )
}

export default Level
