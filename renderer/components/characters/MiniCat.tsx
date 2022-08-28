import { AnimatedSprite, Container, useTick } from '@inlet/react-pixi'
import { useState } from 'react'
import { InteractionEvent } from 'pixi.js'

import { containsPoint } from '../../utils/pixi_api'
import { getRandomInt } from '../../utils/api'
import { State, Position, MiniCatAnimation } from '../../types/character'

interface Props {
  isClickThrough: boolean
}

const BASIC_ANIMATION: MiniCatAnimation = 0
const BLINK_ANIMATION: MiniCatAnimation = 1
const LEFT_ANIMATION: MiniCatAnimation = 2
const RIGHT_ANIMATION: MiniCatAnimation = 3

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
const defaultY = 1050
const minX = 0
const maxX = 1850 /* 画面右 */
const minY = 30
const maxY = defaultY /* 画面下 */

const setNextTargetAndPosition = (state: State) => {
  /* 次のターゲットポジションを決定する */
  const setNextTargetPos = (characterState: State) => {
    /* X座標の決定 */
    if (characterState.moveTick == 0) {
      characterState.targetPos.x = getRandomInt(1400, 1620)
    }
  }

  /* 速度がある時に壁に当たると止まるようにする */
  const judgeWall = (characterState: State) => {
    if (characterState.currentPos.x <= minX) {
      characterState.vx = 0
      characterState.vy = 0
      characterState.currentPos.x = minX
    } else if (characterState.currentPos.x >= maxX) {
      characterState.vx = 0
      characterState.vy = 0
      characterState.currentPos.x = maxX
    } else if (characterState.currentPos.y <= minY) {
      characterState.vx = 0
      characterState.vy = 0
      characterState.currentPos.y = minY
    } else if (characterState.currentPos.y >= maxY) {
      characterState.vx = 0
      characterState.vy = 0
      characterState.currentPos.y = maxY
    }
  }

  /* 次の位置に移動する */
  const setNextPosX = (characterState: State) => {
    if (characterState.vx != 0) {
      /* ドラッグを離した後、水平運動 */
      const dt = 0.2
      const nextX = Math.floor(
        characterState.currentPos.x + characterState.vx * dt
      )
      characterState.currentPos.x = nextX
      return
    }

    /* 地面にいる場合 */
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

  /* 重力落下のみ */
  const setNextPosY = (characterState: State) => {
    const gravity = 9.8
    const dt = 0.2
    const nextY = Math.floor(
      characterState.currentPos.y + characterState.vy * dt
    )
    characterState.currentPos.y = Math.min(nextY, characterState.targetPos.y)
    characterState.vy += gravity * dt
  }

  const setNextAngle = (characterState: State) => {
    if (characterState.currentPos.y <= minY) {
      characterState.angle = 180
    } else {
      characterState.angle = 0
    }
  }

  setNextTargetPos(state)
  judgeWall(state)
  setNextAngle(state)
  setNextPosX(state)
  setNextPosY(state)
}

const playMoveAnimation = (beforeState: State, characterState: State) => {
  /* 瞬き中に横向きになるなどはない */
  if (
    characterState.currentAnimation !== RIGHT_ANIMATION &&
    characterState.currentAnimation !== LEFT_ANIMATION &&
    characterState.currentAnimation !== BASIC_ANIMATION
  ) {
    return
  }

  const dx = characterState.currentPos.x - beforeState.currentPos.x
  if (characterState.angle === 0) {
    if (dx > 0) {
      characterState.currentAnimation = RIGHT_ANIMATION
    } else if (dx < 0) {
      characterState.currentAnimation = LEFT_ANIMATION
    } else {
      characterState.currentAnimation = BASIC_ANIMATION
    }
  } else if (characterState.angle == 180) {
    if (dx > 0) {
      characterState.currentAnimation = LEFT_ANIMATION
    } else if (dx < 0) {
      characterState.currentAnimation = RIGHT_ANIMATION
    } else {
      characterState.currentAnimation = BASIC_ANIMATION
    }
  }
}

const playBlinkAnimation = (characterState: State) => {
  /* 基本型からのみ変更を許可 */
  if (characterState.currentAnimation !== BASIC_ANIMATION) return
  characterState.currentAnimation = BLINK_ANIMATION
}

const startJump = (characterState: State) => {
  /* 初期位置にいる時のみジャンプ可能 */
  if (characterState.currentPos.y !== defaultY) return

  characterState.currentPos.y = defaultY - 1 // defaultYは速度が常に0になるので1上げる
  characterState.vy = -50
}

const MiniCat = ({ isClickThrough = false }: Props) => {
  const [characterState, setCharacterState] = useState<State>({
    currentPos: { x: defaultX, y: defaultY },
    targetPos: { x: defaultX, y: defaultY },
    currentAnimation: BASIC_ANIMATION,
    moveTick: 0,
    dragMode: false,
    vx: 0,
    vy: 0,
    angle: 0,
  })
  const [beforeMousePos, setBeforeMousePos] = useState<Position>({
    x: 0,
    y: 0,
  })
  const [prevTimestamp, setPrevTimestamp] = useState(Date.now()) // dragに使用

  /* 基本アニメーション以外で使用 */
  const handleComplete = () => {
    setCharacterState((prev) => ({
      ...prev,
      currentAnimation: BASIC_ANIMATION,
    }))
  }

  // ドラッグ操作
  const mouseDown = (event: InteractionEvent) => {
    const nx = event.data.global.x
    const ny = event.data.global.y
    setBeforeMousePos({ x: nx, y: ny })
    setPrevTimestamp(Date.now())
    setCharacterState((prev) => ({ ...prev, dragMode: true, angle: 0 }))
  }

  const mouseMove = (event: InteractionEvent) => {
    if (!characterState.dragMode) return
    /* キャラの中心を掴んでいるように見せるため位置を調整 */
    const interval = 1000
    const nx = event.data.global.x
    const ny = event.data.global.y

    /* 速度を求める為に一定時間ごとにマウスの位置と時刻を記録する */
    if (characterState.moveTick % 20 == 0) {
      setBeforeMousePos({ x: nx, y: ny })
      setPrevTimestamp(Date.now())
    }

    setCharacterState((prev) => ({
      ...prev,
      currentPos: { x: nx, y: ny },
      moveTick: (prev.moveTick + 1) % interval,
    }))
  }

  const mouseUp = (event: InteractionEvent) => {
    /* クリックを離したタイミングで速度を加える */
    const nx = event.data.global.x
    const ny = event.data.global.y
    const dt = (Date.now() - prevTimestamp) / 100 // 50は手動で調整した値
    setCharacterState((prev) => ({
      ...prev,
      dragMode: false,
      vx: (nx - beforeMousePos.x) / dt,
      vy: (ny - beforeMousePos.y) / dt,
    }))
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
        scale={0.8}
        angle={characterState.angle}
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
        scale={0.8}
        angle={characterState.angle}
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
        scale={0.8}
        angle={characterState.angle}
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
        isPlaying={characterState.currentAnimation == BLINK_ANIMATION} // ループしないのでtrueにしてはいけない
        initialFrame={1}
        animationSpeed={0.1}
        x={characterState.currentPos.x}
        y={characterState.currentPos.y}
        scale={0.8}
        angle={characterState.angle}
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
