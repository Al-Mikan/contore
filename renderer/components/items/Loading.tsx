import { Text, Container } from '@inlet/react-pixi'
import { TextStyle } from 'pixi.js'

import { BasicSpriteProps } from '../../types/sprite'

interface Props extends BasicSpriteProps {}

const Loading = ({ x = 0, y = 0, scale = 1 }: Props) => {
  return (
    <Container>
      <Text
        text="now loading..."
        anchor={0.5}
        x={x}
        y={y}
        style={
          new TextStyle({
            fontSize: 100,
            fontWeight: '100',
            stroke: 'white',
            fill: 'white',
            fontFamily: 'neue-pixel-sans',
          })
        }
      ></Text>
    </Container>
  )
}

export default Loading
