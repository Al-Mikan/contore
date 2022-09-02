import { Sprite } from '@inlet/react-pixi'
import { InteractionEvent } from 'pixi.js'
import { useState } from 'react'

import { containsPoint, containsPointClickThrouth } from '../../utils/pixi_api'
import { BasicSpriteProps } from '../../types/sprite'

interface Props extends BasicSpriteProps {
  isClickThrouth?: boolean
  handleClick: (event: InteractionEvent) => void
}

const EndBtn = ({
  x = 0,
  y = 0,
  scale = 1,
  isClickThrouth = false,
  handleClick,
}: Props) => {
  const [alpha, setAlpha] = useState(1)
  const mouseover = () => setAlpha(0.8)
  const mouseout = () => setAlpha(1)

  // 属性のみの切り替え方法が不明なので要素ごとわける
  return (
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
      containsPoint={isClickThrouth ? containsPointClickThrouth : containsPoint}
      buttonMode={true}
    />
  )
}

export default EndBtn
