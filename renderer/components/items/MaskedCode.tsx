import { Container, Graphics, PixiRef } from '@inlet/react-pixi'
import { useRef } from 'react'

import { BasicSpriteProps } from '../../types/sprite'
import Mask from '../items/Mask'
import CodeText from '../texts/CodeText'

type IGraphics = PixiRef<typeof Graphics>
interface Props extends BasicSpriteProps {
  maskWidth: number
  maskHeight: number
}

const MaskedCode = ({
  x = 0,
  y = 0,
  scale = 1,
  maskHeight,
  maskWidth,
}: Props) => {
  const maskRef = useRef<IGraphics>(null)

  return (
    <Container x={x} y={y} scale={scale} mask={maskRef.current}>
      <Mask width={maskWidth} height={maskHeight} ref={maskRef} />
      <CodeText />
    </Container>
  )
}

export default MaskedCode
