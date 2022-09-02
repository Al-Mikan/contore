import { Sprite, Container } from '@inlet/react-pixi'

import { BasicSpriteProps } from '../../types/sprite'

interface Props extends BasicSpriteProps {
  n: number
  view_digits: number
}

// 好きな桁数で表示可能
const NumText = ({ x = 0, y = 0, scale = 1, n, view_digits }: Props) => {
  if (n < 0 || 10 ** view_digits <= n) {
    throw new Error(`範囲外の数値が入力されました => ${n}`)
  }

  let digit_array = new Array(0)
  for (let i = 0; i < view_digits; i++) {
    // １の位から
    digit_array.push(Math.floor(n / 10 ** i) % 10)
  }

  return (
    <Container x={x} y={y} scale={scale}>
      {digit_array.reverse().map((v, i) => {
        return <Sprite image={`img/number/${v}.png`} x={50 * i} />
      })}
    </Container>
  )
}

export default NumText
