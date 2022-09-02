import { useState } from 'react'
import { Container, Sprite, Text } from '@inlet/react-pixi'
import { InteractionEvent, TextStyle } from 'pixi.js'

import { Position } from '../../types/character'
import { containsPointClickThrouth } from '../../utils/pixi_api'
import Num from '../items/Num'
import { shouldStrToNum } from '../../utils/api'
import CloseBtn from '../buttons/CloseBtn'
import Coin from '../items/Coin'
import { BasicSpriteProps } from '../../types/sprite'

interface Props extends BasicSpriteProps {
  time: string
  isOpen: boolean
  handleClickToHome: (event: InteractionEvent) => void // Note: useRouterをResultModalから呼ぶとnullが返るのでpropsとして受け取る
}

const ResultModal = ({
  x = 0,
  y = 0,
  scale = 1,
  time,
  isOpen,
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
      image="/img/modal.png"
      visible={isOpen}
      x={pos.x}
      y={pos.y}
      scale={scale}
      interactive={true}
      containsPoint={containsPointClickThrouth}
      mousedown={mouseDown}
      mousemove={mouseMove}
      mouseup={mouseUp}
      mouseupoutside={mouseUp}
    >
      <Sprite anchor={0.5} image="/img/result-text.png" y={-130} scale={0.9} />
      <Container x={-100} y={-30} scale={0.7}>
        <Num n={shouldStrToNum(time[0])} x={0} />
        <Num n={shouldStrToNum(time[1])} x={50} />
        <Text
          text="h"
          anchor={0.5}
          x={120}
          y={40}
          style={
            new TextStyle({
              fontSize: 40,
              fontWeight: '700',
            })
          }
        />
        <Num n={shouldStrToNum(time[3])} x={150} />
        <Num n={shouldStrToNum(time[4])} x={200} />
        <Text
          text="m"
          anchor={0.5}
          x={270}
          y={40}
          style={
            new TextStyle({
              fontSize: 40,
              fontWeight: '700',
            })
          }
        />
      </Container>
      <Container x={30} y={140} scale={0.4}>
        <Coin />
        <Num n={1} x={100} y={-40} scale={1.5} />
        <Num n={8} x={180} y={-40} scale={1.5} />
        <Num n={0} x={260} y={-40} scale={1.5} />
      </Container>

      <CloseBtn
        handleClick={handleClickToHome}
        x={150}
        y={-175}
        scale={0.4}
      ></CloseBtn>
    </Sprite>
  )
}

export default ResultModal
