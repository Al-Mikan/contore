import { AnimatedSprite, Container, useTick } from '@inlet/react-pixi'
import { useState } from 'react'
import { InteractionEvent } from 'pixi.js'

import { containsPoint, containsPointClickThrouth } from '../../utils/PixiAPI'
import { getRandomInt } from '../../utils/api'
import { State, Position, MiniCatAnimation } from '../../types/character'

interface Border {
  minX: number
  maxX: number
  minY: number
  maxY: number
  randomTargetMinX: number // ランダム移動の幅
  randomTargetMaxX: number
}

interface Props {
  isClickThrough?: boolean
  defaultX: number
  defaultY: number
  scale: number
  border: Border
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

const setNextTargetAndPosition = (state: State, border: Border) => {
  /* 次のターゲットポジションを決定する */
  const setNextTargetPos = (characterState: State) => {
    /* X座標の決定 */
    if (characterState.moveTick == 0) {
      characterState.targetPos.x = getRandomInt(
        border.randomTargetMinX,
        border.randomTargetMaxX
      )
    }
  }

  /* 速度がある時に壁に当たると止まるようにする */
  const judgeWall = (characterState: State) => {
    if (characterState.currentPos.x <= border.minX) {
      characterState.vx = 0
      characterState.vy = 0
      characterState.currentPos.x = border.minX
    } else if (characterState.currentPos.x >= border.maxX) {
      characterState.vx = 0
      characterState.vy = 0
      characterState.currentPos.x = border.maxX
    } else if (characterState.currentPos.y <= border.minY) {
      characterState.vx = 0
      characterState.vy = 0
      characterState.currentPos.y = border.minY
    } else if (characterState.currentPos.y >= border.maxY) {
      characterState.vx = 0
      characterState.vy = 0
      characterState.currentPos.y = border.maxY
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

  const setNextAngle = (characterState: State, border: Border) => {
    if (characterState.currentPos.y <= border.minY) {
      characterState.angle = 180
    } else {
      characterState.angle = 0
    }
  }

  setNextTargetPos(state)
  judgeWall(state)
  setNextAngle(state, border)
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

const startJump = (characterState: State, border: Border) => {
  /* 初期位置にいる時のみジャンプ可能 */
  if (characterState.currentPos.y !== border.maxY) return

  characterState.currentPos.y = border.maxY - 1 // defaultYは速度が常に0になるので1上げる
  characterState.vy = -50
}

// デフォルト引数は全画面表示
const MiniCat = ({
  isClickThrough = false,
  defaultX,
  defaultY,
  scale,
  border,
}: Props) => {
  const [characterState, setCharacterState] = useState<State>({
    currentPos: { x: defaultX, y: defaultY },
    targetPos: { x: defaultX, y: defaultY },
    currentAnimation: BASIC_ANIMATION,
    moveTick: 0,
    vx: 0,
    vy: 0,
    angle: 0,
  })
  const [beforeMousePos, setBeforeMousePos] = useState<Position>({
    x: 0,
    y: 0,
  })
  const [prevTimestamp, setPrevTimestamp] = useState(Date.now()) // dragに使用
  const [dragMode, setDragMode] = useState(false) // NOTE: characterStateに含めると、なぜかmousedownで更新されない

  /* 基本アニメーション以外で使用 */
  const handleComplete = () => {
    setCharacterState((prev) => ({
      ...prev,
      currentAnimation: BASIC_ANIMATION,
    }))
  }

  // ドラッグ操作
  const mouseDown = (event: InteractionEvent) => {
    const nx = event.data.getLocalPosition(event.currentTarget.parent).x
    const ny = event.data.getLocalPosition(event.currentTarget.parent).y
    setBeforeMousePos({ x: nx, y: ny })
    setPrevTimestamp(Date.now())
    // ドラッグ中は速度は0から加算する
    setCharacterState((prev) => ({
      ...prev,
      angle: 0,
      vx: 0,
      vy: 0,
    }))
    setDragMode(true)
  }

  const mouseMove = (event: InteractionEvent) => {
    if (!dragMode) return
    event.stopPropagation() // 背景のドラッグをしないように
    /* キャラの中心を掴んでいるように見せるため位置を調整 */
    const interval = 1000
    // NOTE: スケールに対応するために親様相の座標を取る。
    const nx = event.data.getLocalPosition(event.currentTarget.parent).x
    const ny = event.data.getLocalPosition(event.currentTarget.parent).y
    /* 速度は動く度に加算する */
    const dt = (Date.now() - prevTimestamp) / 5

    /* 速度を求める為に一定時間ごとにマウスの位置と時刻を記録する */
    if (characterState.moveTick % 50 == 0) {
      setBeforeMousePos({ x: nx, y: ny })
      setPrevTimestamp(Date.now())

      setCharacterState((prev) => {
        const nvx = prev.vx + (nx - beforeMousePos.x) / dt
        const nvy = prev.vy + (ny - beforeMousePos.y) / dt

        return {
          ...prev,
          currentPos: { x: nx, y: ny },
          moveTick: (prev.moveTick + 1) % interval,
          vx: nvx,
          vy: nvy,
        }
      })
    } else {
      setCharacterState((prev) => {
        return {
          ...prev,
          currentPos: { x: nx, y: ny },
          moveTick: (prev.moveTick + 1) % interval,
        }
      })
    }
  }

  const mouseUp = (event: InteractionEvent) => {
    /* クリックを離したタイミングで速度を加える */
    const nx = event.data.getLocalPosition(event.currentTarget.parent).x
    const ny = event.data.getLocalPosition(event.currentTarget.parent).y
    const dt = (Date.now() - prevTimestamp) / 50 // 即離しに対応するため通常時よりも速度の定数倍を大きくする
    setCharacterState((prev) => {
      const nvx = prev.vx + (nx - beforeMousePos.x) / dt
      const nvy = prev.vy + (ny - beforeMousePos.y) / dt
      return {
        ...prev,
        vx: nvx,
        vy: nvy,
      }
    })
    setDragMode(false)
  }

  /* animation */
  useTick((_) => {
    if (dragMode) {
      /* ドラッグ中は速度を少しずつ減速させる */
      const decelerationRate = 0.99
      const threadhold = 15

      setCharacterState((prev) => {
        let nvx = prev.vx * decelerationRate
        let nvy = prev.vy * decelerationRate
        // 一定の速さ以下では0にする
        if (Math.abs(nvx) < threadhold) nvx = 0
        if (Math.abs(nvy) < threadhold) nvy = 0
        return {
          ...prev,
          vx: nvx,
          vy: nvy,
        }
      })
      return
    }
    /* durationごとにターゲットを変更 */
    const interval = 1000
    const nextState: State = {
      ...characterState,
      currentPos: { ...characterState.currentPos },
      targetPos: { ...characterState.targetPos },
    }
    setNextTargetAndPosition(nextState, border) // currentPos, targetPosの決定
    playMoveAnimation(characterState, nextState)

    if (characterState.currentAnimation == BASIC_ANIMATION) {
      /* たまに瞬きをする */
      if (Math.random() <= 0.005) {
        playBlinkAnimation(nextState)
      }
    }

    /* たまにジャンプする */
    if (Math.random() <= 0.001) {
      startJump(nextState, border)
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
        scale={scale}
        angle={characterState.angle}
        interactive={true}
        visible={characterState.currentAnimation == BASIC_ANIMATION}
        containsPoint={
          isClickThrough ? containsPointClickThrouth : containsPoint
        }
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
        scale={scale}
        angle={characterState.angle}
        interactive={true}
        visible={characterState.currentAnimation == RIGHT_ANIMATION}
        containsPoint={
          isClickThrough ? containsPointClickThrouth : containsPoint
        }
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
        scale={scale}
        angle={characterState.angle}
        interactive={true}
        visible={characterState.currentAnimation == LEFT_ANIMATION}
        containsPoint={
          isClickThrough ? containsPointClickThrouth : containsPoint
        }
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
        scale={scale}
        angle={characterState.angle}
        visible={characterState.currentAnimation == BLINK_ANIMATION}
        loop={false}
        interactive={true}
        onComplete={handleComplete}
        containsPoint={
          isClickThrough ? containsPointClickThrouth : containsPoint
        }
        mousedown={mouseDown}
        mousemove={mouseMove}
        mouseup={mouseUp}
        mouseupoutside={mouseUp}
      />
    </Container>
  )
}

export default MiniCat
