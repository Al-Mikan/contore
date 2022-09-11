import { Sprite, Container } from '@inlet/react-pixi'

import { BasicSpriteProps } from '../../types/sprite'

interface Props extends BasicSpriteProps {
  n: number
  view_digits: number
  is_headzero_displayed?: boolean
}

// 好きな桁数で表示可能
const NumText = ({
  x = 0,
  y = 0,
  scale = 1,
  n,
  view_digits,
  is_headzero_displayed = false,
}: Props) => {
  const lineSpace = 55
  if (n < 0 || 10 ** view_digits <= n) {
    throw new Error(`範囲外の数値が入力されました => ${n}`)
  }

  let digit_array = new Array(0)
  for (let i = 0; i < view_digits; i++) {
    // １の位から
    digit_array.push(Math.floor(n / 10 ** i) % 10)
  }

  digit_array = digit_array.reverse()
  // 先頭の0は表示しない
  for (let i = 0; i < digit_array.length; i++) {
    if (digit_array[i] === 0) {
      digit_array[i] = -1
    } else {
      break
    }
  }

  return (
    <Container x={x} y={y} scale={scale}>
      {digit_array.map((v, i) => {
        if (v === -1) {
          // 空白の役割
          return (
            <Sprite
              image={`/static/img/number/0.png`}
              x={lineSpace * i}
              visible={is_headzero_displayed || i + 1 === digit_array.length} // [0] は表示する
              key={i}
            />
          )
        } else {
          return (
            <Sprite
              image={`/static/img/number/${v}.png`}
              x={lineSpace * i}
              key={i}
              visible={true} // 何故かないと一部の桁が非表示になる
            />
          )
        }
      })}
    </Container>
  )
}

export default NumText
