import { useRouter } from 'next/router'
import { MouseEventHandler, useState } from 'react'
import { Sprite } from '@inlet/react-pixi'
import { InteractionEvent } from 'pixi.js'

import { Position } from '../types/character'
import { containsPoint } from '../utils/pixi_api'

interface Props {
  x?: number
  y?: number
  scale?: number
  time: string
  isOpen: boolean
  setIsOpen: (flag: boolean) => void
}

const ResultModal = ({
  x = 0,
  y = 0,
  scale = 1,
  time,
  isOpen,
  setIsOpen,
}: Props) => {
  const router = useRouter()
  const [dragMode, setDragMode] = useState(false)
  const [pos, setPos] = useState<Position>({ x: x, y: y })
  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()
    router.push('/')
  }

  // ドラッグ操作
  const mouseDown = (event: InteractionEvent) => {
    setDragMode(true)
  }

  const mouseMove = (event: InteractionEvent) => {
    if (!dragMode) return
    const nx = event.data.global.x
    const ny = event.data.global.y
    setPos({ x: nx, y: ny })
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
      containsPoint={containsPoint}
      mousedown={mouseDown}
      mousemove={mouseMove}
      mouseup={mouseUp}
      mouseupoutside={mouseUp}
    ></Sprite>
  )
}

export default ResultModal
