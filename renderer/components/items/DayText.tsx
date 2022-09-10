import { Text } from '@inlet/react-pixi'
import { TextStyle } from 'pixi.js'

import { BasicSpriteProps } from '../../types/sprite'

interface Props extends BasicSpriteProps {
  text: string
}

const DayText = ({ x = 0, y = 0, scale = 1, text }: Props) => {
  let d: string = 'days'
  if (text === '0' || text === '1') {
    d = 'day'
  }
  return (
    <Text
      text={`${text} ${d}`}
      anchor={0}
      x={x}
      y={y}
      scale={scale}
      style={
        new TextStyle({
          fontSize: 50,
          fontWeight: '100',
          fontFamily: 'neue-pixel-sans',
        })
      }
    />
  )
}

export default DayText
