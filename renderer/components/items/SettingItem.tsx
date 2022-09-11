import { Text, Container } from '@inlet/react-pixi'
import { InteractionEvent, TextStyle } from 'pixi.js'

import { BasicSpriteProps } from '../../types/sprite'
import Toggle from '../items/Toggle'

interface Props extends BasicSpriteProps {
  text: string
  isToggle: boolean
  handleClick: (event: InteractionEvent) => void
}

const SettingItem = ({
  x = 0,
  y = 0,
  scale = 1,
  text,
  isToggle,
  handleClick,
}: Props) => {
  return (
    <Container x={x} y={y} scale={scale}>
      <Text
        text={text}
        anchor={0.5}
        x={0}
        y={0}
        style={
          new TextStyle({
            fontSize: 40,
            fontWeight: '100',
            fontFamily: 'neue-pixel-sans',
          })
        }
      />
      <Toggle
        name={text}
        handleClick={handleClick}
        x={160}
        y={0}
        scale={0.4}
        isToggle={isToggle}
      ></Toggle>
    </Container>
  )
}

export default SettingItem
