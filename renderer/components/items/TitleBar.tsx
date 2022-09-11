import { Sprite } from '@inlet/react-pixi'
import { InteractionEvent } from 'pixi.js'
import { useState } from 'react'

import { Position } from '../../types/character'
import { BasicSpriteProps } from '../../types/sprite'
import { containsPointClickThrouth } from '../../utils/PixiAPI'
import CloseBtn from '../buttons/CloseBtn'

interface Props extends BasicSpriteProps {
  width: number
  setParentPos: (pos: Position) => void
  handleCloseBtn: (event: InteractionEvent) => void
}

const TitleBar = ({
  x = 0,
  y = 0,
  width,
  setParentPos,
  handleCloseBtn,
}: Props) => {
  const [dragMode, setDragMode] = useState(false)
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
    const currentCharacterPosX = event.currentTarget.parent.x
    const currentCharacterPosY = event.currentTarget.parent.y
    setParentPos({
      x: currentCharacterPosX + (nx - beforeMousePos.x),
      y: currentCharacterPosY + (ny - beforeMousePos.y),
    })
    setBeforeMousePos({ x: nx, y: ny })
  }

  const mouseUp = (event: InteractionEvent) => {
    setDragMode(false)
  }

  return (
    <>
      <Sprite
        image="/static/img/title-bar.png"
        visible={true}
        x={x}
        y={y}
        width={width}
        interactive={true}
        containsPoint={containsPointClickThrouth}
        mousedown={mouseDown}
        mousemove={mouseMove}
        mouseup={mouseUp}
        mouseupoutside={mouseUp}
      />
      <CloseBtn
        x={x + 5}
        y={y + 2}
        scale={0.4}
        handleClick={handleCloseBtn}
        isClickThrouth={true}
      />
    </>
  )
}

export default TitleBar
