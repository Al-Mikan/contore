import { useState } from 'react'
import { Sprite } from '@inlet/react-pixi'
import { InteractionEvent } from 'pixi.js'

import { Position } from '../../types/character'
import { containsPointClickThrouth } from '../../utils/PixiAPI'
import CloseBtn from '../buttons/CloseBtn'
import { BasicSpriteProps } from '../../types/sprite'

interface Props extends BasicSpriteProps {
  handleClickToHome: (event: InteractionEvent) => void // Note: useRouterをResultModalから呼ぶとnullが返るのでpropsとして受け取る
}

const SettingModal = ({
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
      image="/img/modal.png"
      visible={true}
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
      <CloseBtn
        handleClick={handleClickToHome}
        x={150}
        y={-175}
        scale={0.4}
      ></CloseBtn>
    </Sprite>
  )
}

export default SettingModal
