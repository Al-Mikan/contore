import { InteractionEvent } from 'pixi.js'
import { useState } from 'react'

import { Position } from '../types/character'

interface DragHandler {
  mouseDown: (event: InteractionEvent) => void
  mouseMove: (event: InteractionEvent) => void
  mouseUp: (event: InteractionEvent) => void
}

const useDragMe = (
  setPositionHook: (position: Position) => void
): [boolean, DragHandler] => {
  const [isDragging, setIsDragging] = useState(false)
  const [beforeMousePos, setBeforeMousePos] = useState<Position>({ x: 0, y: 0 })

  const mouseDown = (event: InteractionEvent) => {
    const mouseGlobalX = event.data.global.x
    const mouseGlobalY = event.data.global.y
    setBeforeMousePos({ x: mouseGlobalX, y: mouseGlobalY })
    setIsDragging(true)
  }

  const mouseMove = (event: InteractionEvent) => {
    if (!isDragging) return
    /* currentTargetがnullのバグが発生したので条件分岐する */
    if (event.currentTarget === null || event.currentTarget === undefined)
      return
    /* クリックした場所から移動した差だけ移動する */
    /* nx,nyにセットするだけだと、端っこをクリックするとancharに瞬間移動する */
    const mouseGlobalX = event.data.global.x
    const mouseGlobalY = event.data.global.y
    const targetParentLocalX = event.currentTarget.x
    const targetParentLocalY = event.currentTarget.y
    setPositionHook({
      x: targetParentLocalX + (mouseGlobalX - beforeMousePos.x),
      y: targetParentLocalY + (mouseGlobalY - beforeMousePos.y),
    })
    setBeforeMousePos({ x: mouseGlobalX, y: mouseGlobalY })
  }

  const mouseUp = (event: InteractionEvent) => {
    setIsDragging(false)
  }

  return [isDragging, { mouseDown, mouseMove, mouseUp }]
}

export default useDragMe
