import { Text } from '@inlet/react-pixi'
import { TextStyle } from 'pixi.js'

import { BasicSpriteProps } from '../../types/sprite'

interface Props extends BasicSpriteProps {}

const GameOverText = ({ x = 0, y = 0, scale = 1 }: Props) => {
  return (
    <Text
      text="Game Over"
      x={x}
      y={y}
      scale={scale}
      anchor={0.5}
      style={
        new TextStyle({
          fontSize: 150,
          fontWeight: '900',
          fill: '#ffffff',
          fontFamily: 'neue-pixel-sans',
        })
      }
    />
  )
}

export default GameOverText
