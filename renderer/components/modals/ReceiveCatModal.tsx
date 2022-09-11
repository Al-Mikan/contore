import { useState, useEffect } from 'react'
import { Sprite, Text, Container } from '@inlet/react-pixi'
import { InteractionEvent, TextStyle } from 'pixi.js'

import { Position } from '../../types/character'
import CloseBtn from '../buttons/CloseBtn'
import { BasicSpriteProps } from '../../types/sprite'

interface Props extends BasicSpriteProps {
  handleClickToHome: (event: InteractionEvent) => void // Note: useRouterをResultModalから呼ぶとnullが返るのでpropsとして受け取る
}

const ReceiveCatModal = ({
  x = 0,
  y = 0,
  scale = 1,
  handleClickToHome,
}: Props) => {
  const [dragMode, setDragMode] = useState(false)
  const [pos, setPos] = useState<Position>({ x: x, y: y })
  const [beforeMousePos, setBeforeMousePos] = useState<Position>({ x: 0, y: 0 })

  // ドラッグ操作
  const mouseDown = (event: InteractionEvent) => {
    const nx = event.data.global.x
    const ny = event.data.global.y
    setDragMode(true)
    setBeforeMousePos({ x: nx, y: ny })
  }

  const mouseMove = (event: InteractionEvent) => {
    if (!dragMode) return
    /* currentTargetがnullのバグが発生したので条件分岐する */
    if (event.currentTarget === null || event.currentTarget === undefined)
      return
    /* クリックした場所から移動した差だけ移動する */
    /* nx,nyにセットすると、端っこをクリックすると始め瞬間移動するので必要 */
    const nx = event.data.global.x
    const ny = event.data.global.y
    const currentCharacterPosX = event.currentTarget.x
    const currentCharacterPosY = event.currentTarget.y
    setPos({
      x: currentCharacterPosX + (nx - beforeMousePos.x),
      y: currentCharacterPosY + (ny - beforeMousePos.y),
    })
    setBeforeMousePos({ x: nx, y: ny })
  }

  const mouseUp = (event: InteractionEvent) => {
    setDragMode(false)
  }

  return (
    <Sprite
      anchor={0.5}
      image="/static/img/firstModal/welcome.png"
      visible={true}
      x={pos.x}
      y={pos.y}
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
        handleClick={handleClickToHome}
        x={150}
        y={-175}
        scale={0.4}
      ></CloseBtn>
    </Sprite>
  )
}

export default ReceiveCatModal
