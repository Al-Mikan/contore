import { Sprite } from '@inlet/react-pixi'
import { InteractionEvent } from 'pixi.js'
import { useState } from 'react'

import useDragMe from '../../hooks/useDragMe'
import { Position } from '../../types/character'
import { BasicSpriteProps } from '../../types/sprite'
import CloseBtn from '../buttons/CloseBtn'

interface Props extends BasicSpriteProps {
  handleCloseClcik: (event: InteractionEvent) => void
}

const ReceiveCatModal = ({
  x = 0,
  y = 0,
  scale = 1,
  handleCloseClcik,
}: Props) => {
  const [modalPosition, setModalPosition] = useState<Position>({ x: x, y: y })
  const [isDragging, { mouseDown, mouseMove, mouseUp }] = useDragMe(
    (position: Position) => {
      setModalPosition(position)
    }
  )

  return (
    <Sprite
      anchor={0.5}
      image="/static/img/firstModal/welcome.png"
      visible={true}
      x={modalPosition.x}
      y={modalPosition.y}
      scale={scale}
      interactive={true}
      mousedown={mouseDown}
      mousemove={mouseMove}
      mouseup={mouseUp}
      mouseupoutside={mouseUp}
    >
      <Sprite
        anchor={0.5}
        image="/static/img/firstModal/txt1.png"
        visible={true}
        scale={1.8}
        interactive={true}
        y={20}
        x={0}
      />
      <Sprite
        anchor={0.5}
        image="/static/img/firstModal/txt2.png"
        visible={true}
        scale={1.8}
        interactive={true}
        y={50}
        x={0}
      />
      <Sprite
        anchor={0.5}
        image="/static/img/firstModal/txt3.png"
        visible={true}
        scale={1.8}
        interactive={true}
        y={80}
        x={0}
      />
      <CloseBtn
        handleClick={handleCloseClcik}
        x={150}
        y={-175}
        scale={0.4}
      ></CloseBtn>
    </Sprite>
  )
}

export default ReceiveCatModal
