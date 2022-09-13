import { Container, Text } from '@inlet/react-pixi'
import { InteractionEvent, TextStyle } from 'pixi.js'

import { BasicSpriteProps } from '../../../types/sprite'
import NumBox from '../../items/NumBox'
import MinusBtn from '../MinusBtn'
import PlusBtn from '../PlusBtn'

interface Props extends BasicSpriteProps {
  count: number
  minusHandleClick: (event: InteractionEvent) => void
  plusHandleClick: (event: InteractionEvent) => void
}

const CountBtn = ({
  x = 0,
  y = 0,
  scale = 1,
  count,
  minusHandleClick,
  plusHandleClick,
}: Props) => {
  return (
    <Container x={x} y={y} scale={scale}>
      <MinusBtn y={5} handleClick={minusHandleClick} />
      <NumBox x={30}>
        <Text
          anchor={0.5}
          x={43}
          y={22}
          text={`${count}`}
          style={
            new TextStyle({
              fontSize: 25,
              fontWeight: '700',
              fontFamily: 'neue-pixel-sans',
            })
          }
        />
      </NumBox>
      <PlusBtn x={120} y={5} handleClick={plusHandleClick} />
    </Container>
  )
}

export default CountBtn
