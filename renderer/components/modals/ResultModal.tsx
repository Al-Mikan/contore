import { useState } from 'react'
import { Container, Sprite, Text } from '@inlet/react-pixi'
import { InteractionEvent, TextStyle } from 'pixi.js'

import { Position } from '../../types/character'
import { containsPointClickThrouth } from '../../utils/PixiAPI'
import Num from '../items/Num'
import { shouldStrTimeToSecondNum, shouldStrToNum } from '../../utils/api'
import CloseBtn from '../buttons/CloseBtn'
import Coin from '../items/Coin'
import { BasicSpriteProps } from '../../types/sprite'
import NumText from '../items/NumText'

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
      {/* RESULT TEXT */}
      <Sprite anchor={0.5} image="/img/result-text.png" y={-130} scale={0.9} />

      {/* TIME */}
      <Container x={-140} y={-50} scale={0.5}>
        <Text
          text="TIME"
          x={0}
          y={0}
          style={
            new TextStyle({
              fontSize: 60,
              fontWeight: '100',
            })
          }
        />
        <Container x={300}>
          <Num n={shouldStrToNum(time[0])} x={50 * 0} />
          <Num n={shouldStrToNum(time[1])} x={50 * 1} />
          <Text
            text="h"
            anchor={0.5}
            x={50 * 2 + 20}
            y={40}
            style={
              new TextStyle({
                fontSize: 50,
                fontWeight: '700',
              })
            }
          />
          <Num n={shouldStrToNum(time[3])} x={50 * 3} />
          <Num n={shouldStrToNum(time[4])} x={50 * 4} />
          <Text
            text="m"
            anchor={0.5}
            x={50 * 5 + 20}
            y={40}
            style={
              new TextStyle({
                fontSize: 50,
                fontWeight: '700',
              })
            }
          />
        </Container>
      </Container>
      {/* EXP */}
      <Container x={-100} y={20} scale={0.5}>
        <Text
          text="EXP"
          anchor={0.5}
          x={0}
          y={0}
          style={
            new TextStyle({
              fontSize: 60,
              fontWeight: '100',
            })
          }
        />
        <NumText
          n={shouldStrTimeToSecondNum(time)}
          view_digits={5}
          x={270}
          y={-40}
        />
      </Container>
      {/* COIN */}
      <Container x={-90} y={75} scale={0.5}>
        <Coin x={0} scale={0.7} />
        <NumText n={180} view_digits={3} x={350} y={-40} />
      </Container>

      {/* CLOSE BUTTON */}
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
