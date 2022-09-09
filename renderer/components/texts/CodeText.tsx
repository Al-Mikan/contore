import { Text } from '@inlet/react-pixi'
import { TextStyle } from 'pixi.js'

import { BasicSpriteProps } from '../../types/sprite'

interface Props extends BasicSpriteProps {}

const GameOverText = ({ x = 0, y = 0, scale = 1 }: Props) => {
  const sourceCodeText = `
import { Sprite } from '@inlet/react-pixi'
import { InteractionEvent } from 'pixi.js'
import { useState } from 'react'

import { containsPoint, containsPointClickThrouth } from '../../utils/PixiAPI'
import { BasicSpriteProps } from '../../types/sprite'

interface Props extends BasicSpriteProps {
  isClickThrouth?: boolean
    handleStartClick: (event: InteractionEvent) => void
}

const BuyBtn = ({
  x = 0,
  y = 0,
  scale = 1,
  isClickThrouth = false,
  handleStartClick,
}: Props) => {
  const [alpha, setAlpha] = useState(1)
  const mouseover = () => setAlpha(0.8)
  const mouseout = () => setAlpha(1)

  return (
    <Sprite
      image="/static/img/start-btn.png"
      x={x}
      y={y}
      scale={scale}
      interactive={true}
      alpha={alpha}
      click={handleStartClick}
      mouseover={mouseover}
      mouseout={mouseout}
      containsPoint={isClickThrouth ? containsPointClickThrouth : containsPoint}
      buttonMode={true}
    />
  )
}

export default BuyBtn
`

  return (
    <Text
      text={sourceCodeText}
      x={x}
      y={y}
      scale={scale}
      style={
        new TextStyle({
          fontSize: 5,
          fontWeight: '100',
          fontFamily: 'neue-pixel-sans',
          fill: '#ffffff',
        })
      }
    />
  )
}

export default GameOverText
