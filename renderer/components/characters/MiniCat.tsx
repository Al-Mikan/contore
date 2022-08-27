import { AnimatedSprite, Container, useTick } from '@inlet/react-pixi'
import { useState } from 'react'

import { containsPoint } from '../../utils/pixi_api'
import { getRandomInt } from '../../utils/api'
import { InteractionEvent } from 'pixi.js'

type Animation = 0 | 1

interface Props {
  isClickThrough: boolean
}

interface Position {
  x: number
  y: number
}

interface State {
  currentPos: Position // 現在位置
  targetPos: Position // 最終的な目標位置 (次フレームの位置ではない)
  currentAnimation: Animation
  moveTick: number
  dragMode: boolean
}

const BASIC_ANIMATION: Animation = 0
const BLINK_ANIMATION: Animation = 1

const MiniCat = ({ isClickThrough = false }: Props) => {
  const basicAnimationImages = ['/img/mini-cat/1.png']
  const blinkAnimationImages = [
    '/img/mini-cat/1.png',
    '/img/mini-cat/2.png',
    '/img/mini-cat/3.png',
    '/img/mini-cat/2.png',
  ]
  const defaultX = 900
  const defaultY = 950

  const [characterState, setCharacterState] = useState<State>({
    currentPos: { x: defaultX, y: defaultY },
    targetPos: { x: defaultX, y: defaultY },
    currentAnimation: BASIC_ANIMATION,
    moveTick: 0,
    dragMode: false,
  })

  /* 次のターゲットポジションを決定する */
  const setNextTargetPos = () => {
    let targetX = characterState.targetPos.x
    let targetY = characterState.targetPos.y
    /* X座標の決定 */
    if (characterState.moveTick == 0) {
      targetX = getRandomInt(0, 1920)
    }

    /* Y座標の決定 */
    if (characterState.targetPos.y == characterState.currentPos.y) {
      if (defaultY == characterState.currentPos.y) {
        /* 初期位置 */
      } else {
        /* ジャンプの頂上。落下を開始 */
        targetY = defaultY
      }
    }

    setCharacterState((prev) => ({
      ...prev,
      targetPos: { x: targetX, y: targetY },
    }))
  }

  /* 次の位置に移動する */
  const setNextPosX = () => {
    if (characterState.currentPos.x == characterState.targetPos.x) return
    const speed = 2

    const directionX =
      (characterState.targetPos.x - characterState.currentPos.x) /
      Math.abs(characterState.targetPos.x - characterState.currentPos.x)
    if (directionX > 0) {
      /* -> */
      setCharacterState((prev) => ({
        ...prev,
        currentPos: {
          x: Math.min(prev.currentPos.x + directionX * speed, prev.targetPos.x),
          y: prev.currentPos.y,
        },
      }))
    } else {
      /* <- */
      setCharacterState((prev) => ({
        ...prev,
        currentPos: {
          x: Math.max(prev.currentPos.x + directionX * speed, prev.targetPos.x),
          y: prev.currentPos.y,
        },
      }))
    }
  }

  const setNextPosY = () => {
    if (characterState.currentPos.y == characterState.targetPos.y) return

    const speed = 2
    const directionY =
      (characterState.targetPos.y - characterState.currentPos.y) /
      Math.abs(characterState.targetPos.y - characterState.currentPos.y)
    if (directionY > 0) {
      /* 落下中 */
      setCharacterState((prev) => ({
        ...prev,
        currentPos: {
          x: prev.currentPos.x,
          y: Math.min(prev.currentPos.y + directionY * speed, prev.targetPos.y),
        },
      }))
    } else {
      /* 上昇中 */
      setCharacterState((prev) => ({
        ...prev,
        currentPos: {
          x: prev.currentPos.x,
          y: Math.max(prev.currentPos.y + directionY * speed, prev.targetPos.y),
        },
      }))
    }
  }

  /* clickでアニメーションを切り替え */
  const switchAnimation = (targetAnimation: 0 | 1) => {
    /* 基本型からのみ変更を許可 */
    if (characterState.currentAnimation !== BASIC_ANIMATION) return
    setCharacterState({ ...characterState, currentAnimation: targetAnimation })
  }

  /* 基本アニメーション以外で使用 */
  const handleComplete = () => {
    setCharacterState({ ...characterState, currentAnimation: BASIC_ANIMATION })
  }

  // ドラッグ操作
  const mouseDown = (event: InteractionEvent) => {
    setCharacterState({ ...characterState, dragMode: true })
  }

  const mouseMove = (event: InteractionEvent) => {
    if (!characterState.dragMode) return
    /* キャラの中心を掴んでいるように見せるため位置を調整 */
    const x = event.data.global.x
    const y = event.data.global.y - 100
    setCharacterState({ ...characterState, currentPos: { x, y } })
  }

  const mouseUp = (event: InteractionEvent) => {
    setCharacterState({ ...characterState, dragMode: false })
  }

  const startJump = () => {
    const height = 50
    /* 2段ジャンプは不可 */
    if (characterState.currentPos.y != defaultY) return

    setCharacterState((prev) => ({
      ...prev,
      targetPos: { x: prev.targetPos.x, y: defaultY - height },
    }))
  }

  /* animation */
  useTick((_) => {
    if (characterState.dragMode) return
    /* durationごとにターゲットを変更 */
    const interval = 1000
    setNextTargetPos()
    setNextPosX()
    setNextPosY()

    if (characterState.currentAnimation == BASIC_ANIMATION) {
      /* たまに瞬きをする */
      if (Math.random() <= 0.005) {
        switchAnimation(BLINK_ANIMATION)
      }

      /* たまにジャンプする */
      if (Math.random() <= 0.001) {
        startJump()
      }
    }

    setCharacterState((prev) => ({
      ...prev,
      moveTick: (prev.moveTick + 1) % interval,
    }))
  })

  return (
    <Container>
      {/* 基礎モーション */}
      <AnimatedSprite
        anchor={0.5}
        images={basicAnimationImages}
        isPlaying={true}
        initialFrame={0}
        animationSpeed={0.05}
        x={characterState.currentPos.x}
        y={characterState.currentPos.y}
        scale={1}
        interactive={true}
        visible={characterState.currentAnimation == BASIC_ANIMATION}
        containsPoint={isClickThrough && containsPoint}
        mousedown={mouseDown}
        mousemove={mouseMove}
        mouseup={mouseUp}
        mouseupoutside={mouseUp}
      />
      {/* 瞬き */}
      <AnimatedSprite
        anchor={0.5}
        images={blinkAnimationImages}
        isPlaying={characterState.currentAnimation == BLINK_ANIMATION}
        initialFrame={0}
        animationSpeed={0.1}
        x={characterState.currentPos.x}
        y={characterState.currentPos.y}
        scale={1}
        visible={characterState.currentAnimation == BLINK_ANIMATION}
        loop={false}
        interactive={true}
        onComplete={handleComplete}
        containsPoint={isClickThrough && containsPoint}
        mousedown={mouseDown}
        mousemove={mouseMove}
        mouseup={mouseUp}
        mouseupoutside={mouseUp}
      />
    </Container>
  )
}

export default MiniCat
