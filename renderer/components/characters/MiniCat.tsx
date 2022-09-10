import {
  AnimatedSprite,
  Container,
  useTick,
  Sprite,
  PixiRef,
} from '@inlet/react-pixi'
import { useState, MutableRefObject } from 'react'
import { InteractionEvent } from 'pixi.js'

import { containsPoint, containsPointClickThrouth } from '../../utils/PixiAPI'
import { getRandomInt } from '../../utils/common'
import {
  State,
  Position,
  Border,
  CharacterCondition,
} from '../../types/character'

type ISprite = PixiRef<typeof Sprite>

interface Props {
  isClickThrough?: boolean
  defaultX: number
  defaultY: number
  scale: number
  border: Border
  targetSpriteRef?: MutableRefObject<ISprite>
  handleTargetCollision?: () => void
}

const BASIC_ANIMATION = 0
const BLINK_ANIMATION = 1
const LEFT_ANIMATION = 2
const RIGHT_ANIMATION = 3
const SQUAT_ANIMATION = 4
const EAINTG_ANIMATION = 5
const DRAG_ANIMATION = 6

const animationMap = new Map<number, Array<string>>()
animationMap.set(BASIC_ANIMATION, ['/static/img/mini-cat/1.png'])
animationMap.set(BLINK_ANIMATION, [
  '/static/img/mini-cat/2.png',
  '/static/img/mini-cat/3.png',
  '/static/img/mini-cat/2.png',
])
animationMap.set(LEFT_ANIMATION, ['/static/img/mini-cat/left.png'])
animationMap.set(RIGHT_ANIMATION, ['/static/img/mini-cat/right.png'])
animationMap.set(SQUAT_ANIMATION, ['/static/img/mini-cat/squat.png'])
animationMap.set(EAINTG_ANIMATION, [
  '/static/img/mini-cat/1.png',
  '/static/img/mini-cat/tail2.png',
])
animationMap.set(DRAG_ANIMATION, ['/static/img/mini-cat/drag.png'])

class MiniCatCondition extends CharacterCondition {
  public targetRef: MutableRefObject<ISprite> | null | undefined
  public handleTargetCollision: () => void

  constructor(
    beforState: State,
    border: Border,
    targetRef: MutableRefObject<ISprite>,
    handleTargetCollision: () => void
  ) {
    super(beforState, border)
    this.targetRef = targetRef
    this.handleTargetCollision = handleTargetCollision
  }

  protected _updateNextTargetPos() {
    // ターゲットがあれば追う
    if (this.targetRef && this.targetRef.current) {
      if (this._isCollisionWithTargetRef()) {
        if (this.handleTargetCollision) this.handleTargetCollision()
        return
      }
      this.state.targetPos.x = this.targetRef.current.x
      this.state.targetPos.y = this.border.maxY
      return
    }

    if (this.state.moveTick === 0) {
      this.state.targetPos.x = getRandomInt(
        this.border.randomTargetMinX,
        this.border.randomTargetMaxX
      )
    }
  }

  /* 速度がある時に壁に当たると止まるようにする */
  protected _judgeWall() {
    if (this.state.currentPos.x <= this.border.minX) {
      // 左
      this.state.currentPos.x = this.border.minX
    } else if (this.state.currentPos.x >= this.border.maxX) {
      // 右
      this.state.currentPos.x = this.border.maxX
    } else if (this.state.currentPos.y <= this.border.minY) {
      // 上
      this.state.currentPos.y = this.border.minY
    } else if (this.state.currentPos.y >= this.border.maxY) {
      // 下
      this.state.currentPos.y = this.border.maxY
    } else {
      return
    }
    this.state.vx = 0
    this.state.vy = 0
  }

  protected _setNextAngle() {
    if (this.state.currentPos.y <= this.border.minY) {
      this.state.angle = 180
    } else {
      this.state.angle = 0
    }
  }

  protected _setNextPosX() {
    if (this.state.vx != 0) {
      /* ドラッグを離した後、水平運動 */
      const dt = 0.2
      const nextX = Math.floor(this.state.currentPos.x + this.state.vx * dt)
      this.state.currentPos.x = nextX
      return
    }

    /* 地面にいる場合 */
    /* 移動モーション時だけ移動する */
    if (
      this.state.currentAnimation !== RIGHT_ANIMATION &&
      this.state.currentAnimation !== LEFT_ANIMATION &&
      this.state.currentAnimation !== BASIC_ANIMATION
    ) {
      return
    }
    if (this.state.currentPos.x == this.state.targetPos.x) return
    const speed = 3

    const directionX =
      (this.state.targetPos.x - this.state.currentPos.x) /
      Math.abs(this.state.targetPos.x - this.state.currentPos.x)
    if (directionX > 0) {
      /* -> */
      this.state.currentPos.x = Math.min(
        this.state.currentPos.x + directionX * speed,
        this.state.targetPos.x
      )
    } else {
      /* <- */
      this.state.currentPos.x = Math.max(
        this.state.currentPos.x + directionX * speed,
        this.state.targetPos.x
      )
    }
  }

  protected _setNextPosY() {
    // 重力落下のみ
    const gravity = 9.8
    const dt = 0.2
    const nextY = Math.floor(this.state.currentPos.y + this.state.vy * dt)
    this.state.currentPos.y = Math.min(nextY, this.state.targetPos.y)
    this.state.vy += gravity * dt
  }

  private _playMoveAnimation() {
    /* 非ループアニメーション時は移動しない */
    if (
      this.state.currentAnimation === BLINK_ANIMATION ||
      this.state.currentAnimation === SQUAT_ANIMATION
    ) {
      return
    }

    const dx = this.state.currentPos.x - this.beforeState.currentPos.x
    if (this.state.angle === 0) {
      if (dx > 0) {
        this.state.currentAnimation = RIGHT_ANIMATION
      } else if (dx < 0) {
        this.state.currentAnimation = LEFT_ANIMATION
      } else {
        this.state.currentAnimation = BASIC_ANIMATION
      }
    } else if (this.state.angle == 180) {
      if (dx > 0) {
        this.state.currentAnimation = LEFT_ANIMATION
      } else if (dx < 0) {
        this.state.currentAnimation = RIGHT_ANIMATION
      } else {
        this.state.currentAnimation = BASIC_ANIMATION
      }
    }
  }

  private _playBlinkAnimation() {
    /* 基本型からのみ変更を許可 */
    if (this.state.currentAnimation !== BASIC_ANIMATION) return
    this.state.currentAnimation = BLINK_ANIMATION
  }

  private _playStartJump() {
    /* 地面にいる時のみジャンプ可能 */
    if (this.state.currentPos.y !== this.border.maxY) return

    this.state.currentPos.y = this.border.maxY - 1 // defaultYは速度が常に0になるので1上げる
    this.state.vy = -50
  }

  private _playSquatAnimation() {
    /* 基本型からのみ変更を許可 */
    if (this.state.currentAnimation !== BASIC_ANIMATION) return
    // 天井または地面のみしゃがむ
    if (
      this.state.currentPos.y !== this.border.minY &&
      this.state.currentPos.y !== this.border.maxY
    ) {
      return
    }
    this.state.currentAnimation = SQUAT_ANIMATION
  }

  private _playEatingAnimation() {
    if (this._isCollisionWithTargetRef()) {
      this.state.currentAnimation = EAINTG_ANIMATION
    }
  }

  private _isCollisionWithTargetRef() {
    return (
      this.targetRef &&
      this.targetRef.current &&
      this.targetRef.current.x === this.state.currentPos.x &&
      this.targetRef.current.y === this.state.currentPos.y
    )
  }

  protected updateNextAnimation() {
    if (this._isCollisionWithTargetRef()) {
      this._playEatingAnimation()
      return
    }
    this._playMoveAnimation()

    /* たまにジャンプする */
    if (Math.random() <= 0.0008) {
      this._playStartJump()
    }

    /* たまに瞬きをする */
    if (Math.random() <= 0.001) {
      this._playBlinkAnimation()
    }

    /* たまにしゃがむ */
    if (Math.random() <= 0.0008) {
      this._playSquatAnimation()
    }
  }

  public updateNextState() {
    this.computeAndUpdateNextPos()
    this.updateNextAnimation()
    this.updateNextTick()
  }
}

// デフォルト引数は全画面表示
const MiniCat = ({
  isClickThrough = false,
  defaultX,
  defaultY,
  scale,
  border,
  targetSpriteRef,
  handleTargetCollision,
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
          currentAnimation: DRAG_ANIMATION,
        }
      })
      return
    }

    const mc = new MiniCatCondition(
      characterState,
      border,
      targetSpriteRef,
      handleTargetCollision
    )
    mc.updateNextState()
    // mc.stateは内部でディープコピーされている
    setCharacterState(mc.state)
  })

  return (
    <Container>
      {/* 基礎モーション */}
      <AnimatedSprite
        images={animationMap.get(BASIC_ANIMATION)}
        visible={characterState.currentAnimation == BASIC_ANIMATION}
        anchor={0.5}
        isPlaying={true}
        initialFrame={0}
        animationSpeed={0.05}
        x={characterState.currentPos.x}
        y={characterState.currentPos.y}
        scale={scale}
        angle={characterState.angle}
        interactive={true}
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
        images={animationMap.get(RIGHT_ANIMATION)}
        visible={characterState.currentAnimation == RIGHT_ANIMATION}
        anchor={0.5}
        isPlaying={true}
        initialFrame={0}
        animationSpeed={0.05}
        x={characterState.currentPos.x}
        y={characterState.currentPos.y}
        scale={scale}
        angle={characterState.angle}
        interactive={true}
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
        images={animationMap.get(LEFT_ANIMATION)}
        visible={characterState.currentAnimation == LEFT_ANIMATION}
        anchor={0.5}
        isPlaying={true}
        initialFrame={0}
        animationSpeed={0.05}
        x={characterState.currentPos.x}
        y={characterState.currentPos.y}
        scale={scale}
        angle={characterState.angle}
        interactive={true}
        containsPoint={
          isClickThrough ? containsPointClickThrouth : containsPoint
        }
        mousedown={mouseDown}
        mousemove={mouseMove}
        mouseup={mouseUp}
        mouseupoutside={mouseUp}
      />
      {/* 食事 */}
      <AnimatedSprite
        images={animationMap.get(EAINTG_ANIMATION)}
        visible={characterState.currentAnimation == EAINTG_ANIMATION}
        anchor={0.5}
        isPlaying={true}
        initialFrame={0}
        animationSpeed={0.05}
        x={characterState.currentPos.x}
        y={characterState.currentPos.y}
        scale={scale}
        angle={characterState.angle}
        interactive={true}
        containsPoint={
          isClickThrough ? containsPointClickThrouth : containsPoint
        }
        mousedown={mouseDown}
        mousemove={mouseMove}
        mouseup={mouseUp}
        mouseupoutside={mouseUp}
      />
      {/* ドラッグ */}
      <AnimatedSprite
        images={animationMap.get(DRAG_ANIMATION)}
        visible={characterState.currentAnimation == DRAG_ANIMATION}
        anchor={0.5}
        isPlaying={true}
        initialFrame={0}
        animationSpeed={0.05}
        x={characterState.currentPos.x}
        y={characterState.currentPos.y}
        scale={scale}
        angle={characterState.angle}
        interactive={true}
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
        images={animationMap.get(BLINK_ANIMATION)}
        isPlaying={characterState.currentAnimation == BLINK_ANIMATION} // ループしないのでtrueにしてはいけない
        visible={characterState.currentAnimation == BLINK_ANIMATION}
        loop={false}
        onComplete={handleComplete}
        anchor={0.5}
        initialFrame={0}
        animationSpeed={0.1}
        x={characterState.currentPos.x}
        y={characterState.currentPos.y}
        scale={scale}
        angle={characterState.angle}
        interactive={true}
        containsPoint={
          isClickThrough ? containsPointClickThrouth : containsPoint
        }
        mousedown={mouseDown}
        mousemove={mouseMove}
        mouseup={mouseUp}
        mouseupoutside={mouseUp}
      />
      {/* しゃがむ */}
      <AnimatedSprite
        images={animationMap.get(SQUAT_ANIMATION)}
        isPlaying={characterState.currentAnimation == SQUAT_ANIMATION} // ループしないのでtrueにしてはいけない
        visible={characterState.currentAnimation == SQUAT_ANIMATION}
        loop={false}
        onComplete={handleComplete}
        anchor={0.5}
        initialFrame={0}
        animationSpeed={0.005}
        x={characterState.currentPos.x}
        y={characterState.currentPos.y}
        scale={scale}
        angle={characterState.angle}
        interactive={true}
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
