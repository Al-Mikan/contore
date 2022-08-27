import { AnimatedSprite, Container, useTick } from '@inlet/react-pixi'
import { useState } from 'react'

import { containsPoint } from '../../utils/pixi_api'
import { getRandomInt } from '../../utils/api'
import { InteractionEvent } from 'pixi.js'

type Animation = 0 | 1 | 2 | 3

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
const LEFT_ANIMATION: Animation = 2
const RIGHT_ANIMATION: Animation = 3

const basicAnimationImages = ['/img/mini-cat/1.png']
const blinkAnimationImages = [
  '/img/mini-cat/1.png',
  '/img/mini-cat/2.png',
  '/img/mini-cat/3.png',
  '/img/mini-cat/2.png',
]
const leftAnimationImages = ['/img/mini-cat/left.png']
const rightAnimationImages = ['/img/mini-cat/right.png']

const defaultX = 900
const defaultY = 950

const setNextTargetAndPosition = (state: State) => {
  /* 次のターゲットポジションを決定する */
  const setNextTargetPos = (characterState: State) => {
    let targetX = characterState.targetPos.x
    let targetY = characterState.targetPos.y
    /* X座標の決定 */
    if (characterState.moveTick == 0) {
      targetX = getRandomInt(100, 1820)
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

    characterState.targetPos.x = targetX
    characterState.targetPos.y = targetY
  }

  /* 次の位置に移動する */
  const setNextPosX = (characterState: State) => {
    if (characterState.currentPos.x == characterState.targetPos.x) return
    const speed = 3

    const directionX =
      (characterState.targetPos.x - characterState.currentPos.x) /
      Math.abs(characterState.targetPos.x - characterState.currentPos.x)
    if (directionX > 0) {
      /* -> */
      characterState.currentPos.x = Math.min(
        characterState.currentPos.x + directionX * speed,
        characterState.targetPos.x
      )
    } else {
      /* <- */
      characterState.currentPos.x = Math.max(
        characterState.currentPos.x + directionX * speed,
        characterState.targetPos.x
      )
    }
  }

  const setNextPosY = (characterState: State) => {
    if (characterState.currentPos.y == characterState.targetPos.y) return

    const speed = 5
    const directionY =
      (characterState.targetPos.y - characterState.currentPos.y) /
      Math.abs(characterState.targetPos.y - characterState.currentPos.y)
    if (directionY > 0) {
      /* 落下中 */
      characterState.currentPos.y = Math.min(
        characterState.currentPos.y + directionY * speed,
        characterState.targetPos.y
      )
    } else {
      /* 上昇中 */
      characterState.currentPos.y = Math.max(
        characterState.currentPos.y + directionY * speed,
        characterState.targetPos.y
      )
    }
  }

  setNextTargetPos(state)
  setNextPosX(state)
  setNextPosY(state)
}

const playMoveAnimation = (beforeState: State, characterState: State) => {
  const dx = characterState.currentPos.x - beforeState.currentPos.x
  if (dx > 0) {
    characterState.currentAnimation = RIGHT_ANIMATION
  } else if (dx < 0) {
    characterState.currentAnimation = LEFT_ANIMATION
  } else {
    characterState.currentAnimation = BASIC_ANIMATION
  }
}

const playBlinkAnimation = (characterState: State) => {
  /* 基本型からのみ変更を許可 */
  if (characterState.currentAnimation !== BASIC_ANIMATION) return
  characterState.currentAnimation = BLINK_ANIMATION
}

const startJump = (characterState: State) => {
  const height = 50
  /* 初期位置にいる時のみジャンプ可能 */
  if (characterState.currentPos.y != defaultY) return

  characterState.targetPos.y = defaultY - height
}

const MiniCat = ({ isClickThrough = false }: Props) => {
  const [characterState, setCharacterState] = useState<State>({
    currentPos: { x: defaultX, y: defaultY },
    targetPos: { x: defaultX, y: defaultY },
    currentAnimation: BASIC_ANIMATION,
    moveTick: 0,
    dragMode: false,
  })

  /* 基本アニメーション以外で使用 */
  const handleComplete = () => {
    setCharacterState((prev) => ({
      ...prev,
      currentAnimation: BASIC_ANIMATION,
    }))
  }

  // ドラッグ操作
  const mouseDown = (event: InteractionEvent) => {
    setCharacterState((prev) => ({ ...prev, dragMode: true }))
  }

  const mouseMove = (event: InteractionEvent) => {
    if (!characterState.dragMode) return
    /* キャラの中心を掴んでいるように見せるため位置を調整 */
    const x = event.data.global.x
    const y = event.data.global.y - 100
    setCharacterState((prev) => ({ ...prev, currentPos: { x, y } }))
  }

  const mouseUp = (event: InteractionEvent) => {
    setCharacterState((prev) => ({ ...prev, dragMode: false }))
  }

  /* animation */
  useTick((_) => {
    if (characterState.dragMode) return
    /* durationごとにターゲットを変更 */
    const interval = 1000
    const nextState: State = {
      ...characterState,
      currentPos: { ...characterState.currentPos },
      targetPos: { ...characterState.targetPos },
    }
    setNextTargetAndPosition(nextState) // currentPos, targetPosの決定
    playMoveAnimation(characterState, nextState)

    if (characterState.currentAnimation == BASIC_ANIMATION) {
      /* たまに瞬きをする */
      if (Math.random() <= 0.005) {
        playBlinkAnimation(nextState)
      }
    }

    /* たまにジャンプする */
    if (Math.random() <= 0.001) {
      startJump(nextState)
    }

    nextState.moveTick = (nextState.moveTick + 1) % interval
    setCharacterState(nextState)
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
      {/* 右歩行 */}
      <AnimatedSprite
        anchor={0.5}
        images={rightAnimationImages}
        isPlaying={true}
        initialFrame={0}
        animationSpeed={0.05}
        x={characterState.currentPos.x}
        y={characterState.currentPos.y}
        scale={1}
        interactive={true}
        visible={characterState.currentAnimation == RIGHT_ANIMATION}
        containsPoint={isClickThrough && containsPoint}
        mousedown={mouseDown}
        mousemove={mouseMove}
        mouseup={mouseUp}
        mouseupoutside={mouseUp}
      />
      {/* 左歩行 */}
      <AnimatedSprite
        anchor={0.5}
        images={leftAnimationImages}
        isPlaying={true}
        initialFrame={0}
        animationSpeed={0.05}
        x={characterState.currentPos.x}
        y={characterState.currentPos.y}
        scale={1}
        interactive={true}
        visible={characterState.currentAnimation == LEFT_ANIMATION}
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
