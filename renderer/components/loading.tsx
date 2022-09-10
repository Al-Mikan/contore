import { Text, Container } from '@inlet/react-pixi'
import { TextStyle } from 'pixi.js'
// import { BasicSpriteProps } from '../../types/sprite'

// interface Props extends BasicSpriteProps {

// }

const Loading = () => {
  return (
    <Container>
      <Text
        text="now loading..."
        anchor={0.5}
        x={1000}
        y={480}
        style={
          new TextStyle({
            fontSize: 100,
            fontWeight: '100',
            stroke: 'white',
            fill: 'white',
          })
        }
      ></Text>
    </Container>
  )
}

export default Loading
