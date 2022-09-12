import { InteractionEvent } from 'pixi.js'
import { useState } from 'react'

import { Position } from '../types/character'

type PixiEventHandler = (event: InteractionEvent) => void
type DragItem = [boolean, PixiEventHandler, PixiEventHandler, PixiEventHandler]

const useDrag = (setPositionHook: (position: Position) => void) => {
  const [isDragging, setIsDragging] = useState(false)
  const [beforeMousePos, setBeforeMousePos] = useState<Position>({ x: 0, y: 0 })

  const mouseDown: PixiEventHandler = (event) => {
    const mouseGlobalX = event.data.global.x
    const mouseGlobalY = event.data.global.y
    setBeforeMousePos({ x: mouseGlobalX, y: mouseGlobalY })
    setIsDragging(true)
  }

  const mouseMove: PixiEventHandler = (event) => {
    if (!isDragging) return
    /* currentTargetがnullのバグが発生したので条件分岐する */
    if (event.currentTarget === null || event.currentTarget === undefined)
      return
    /* クリックした場所から移動した差だけ移動する */
    /* nx,nyにセットするだけだと、端っこをクリックするとancharに瞬間移動する */
    const mouseGlobalX = event.data.global.x
    const mouseGlobalY = event.data.global.y
    const targetParentLocalX = event.currentTarget.parent.x
    const targetParentLocalY = event.currentTarget.parent.y
    setPositionHook({
      x: targetParentLocalX + (mouseGlobalX - beforeMousePos.x),
      y: targetParentLocalY + (mouseGlobalY - beforeMousePos.y),
    })
    setBeforeMousePos({ x: mouseGlobalX, y: mouseGlobalY })
  }

  const mouseUp: PixiEventHandler = (event) => {
    setIsDragging(false)
  }

  const retItem: DragItem = [isDragging, mouseDown, mouseMove, mouseUp]
  return retItem
}

export default useDrag
