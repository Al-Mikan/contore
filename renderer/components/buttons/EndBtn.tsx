import { Sprite } from '@inlet/react-pixi'
import { InteractionEvent } from 'pixi.js'
import { useState } from 'react'

import { containsPoint } from '../../utils/pixi_api'

interface Props {
  x?: number
  y?: number
  scale?: number
  isClickThrouth?: boolean
  handleClick: (event: InteractionEvent) => void
}

const EndBtn = ({
  x = 0,
  y = 0,
  scale = 1,
  isClickThrouth = true,
  handleClick,
}: Props) => {
  const [alpha, setAlpha] = useState(1)
  const mouseover = () => setAlpha(0.8)
  const mouseout = () => setAlpha(1)

  // 属性のみの切り替え方法が不明なので要素ごとわける
  return (
    <>
      {isClickThrouth ? (
        <Sprite
          image="/img/end-btn.png"
          x={x}
          y={y}
          scale={scale}
          interactive={true}
          alpha={alpha}
          click={handleClick}
          mouseover={mouseover}
          mouseout={mouseout}
          containsPoint={containsPoint}
        />
      ) : (
        <Sprite
          image="/img/end-btn.png"
          x={x}
          y={y}
          scale={scale}
          interactive={true}
          alpha={alpha}
          click={handleClick}
          mouseover={mouseover}
          mouseout={mouseout}
        />
      )}
    </>
  )
}

export default EndBtn
