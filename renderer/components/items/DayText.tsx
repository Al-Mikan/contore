import { Text, Container } from '@inlet/react-pixi'
import { InteractionEvent, TextStyle } from 'pixi.js'

import { BasicSpriteProps } from '../../types/sprite'

interface Props extends BasicSpriteProps {
  text
}

const DayText = ({
  x = 0,
  y = 0,
  scale = 1,
  text
}: Props) => {
  let d: string = 'days'
  if (text === '0' || text === '1') {
    d = 'day'
  }
  return (
    <Text
      text={text+d}
      anchor={0}
      x={x}
      y={y}
      scale={scale}
      style={
        new TextStyle({
        })
      }
    />
  )
}

export default DayText