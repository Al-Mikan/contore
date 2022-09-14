import { PixiRef, Sprite, useTick } from '@inlet/react-pixi'
import { InteractionEvent } from 'pixi.js'
import { forwardRef, useState } from 'react'

import {
  Border,
  CharacterCondition,
  Position,
  State,
} from '../../types/character'
import { containsPoint, containsPointClickThrouth } from '../../utils/PixiAPI'

type ISprite = PixiRef<typeof Sprite>

interface Props {
  isClickThrough?: boolean
  defaultX: number
  defaultY: number
  scale: number
  border: Border
}

class MiniCatCondition extends CharacterCondition {
  protected _updateNextTargetPos() {
    this.state.targetPos.y = this.border.maxY
  }

  /* 速度がある時に壁に当たると止まるようにする */
  protected _judgeWall() {
    if (this.state.currentPos.x <= this.border.minX) {
      // 左
      this.state.vx = -this.state.vx * 0.5
      this.state.vy = 0
      this.state.currentPos.x = this.border.minX
    } else if (this.state.currentPos.x >= this.border.maxX) {
      // 右
      this.state.vx = -this.state.vx * 0.5
      this.state.vy = 0
      this.state.currentPos.x = this.border.maxX
    } else if (this.state.currentPos.y <= this.border.minY) {
      // 上
      this.state.vy = 20
      this.state.currentPos.y = this.border.minY
    } else if (this.state.currentPos.y >= this.border.maxY) {
      // 下
      this.state.vx = 0
      this.state.vy = 0
      this.state.currentPos.y = this.border.maxY
    } else {
      return
    }
  }

  protected _setNextAngle() {}

  protected _setNextPosX() {
    if (this.state.vx != 0) {
      /* ドラッグを離した後、水平運動 */
      const dt = 0.2
      const nextX = Math.floor(this.state.currentPos.x + this.state.vx * dt)
      this.state.currentPos.x = nextX
      return
    }
  }

  protected _setNextPosY() {
    // 重力落下のみ
    const gravity = 3.0
    const dt = 0.2
    const nextY = Math.floor(this.state.currentPos.y + this.state.vy * dt)
    this.state.currentPos.y = Math.min(nextY, this.state.targetPos.y)
    this.state.vy += gravity * dt
  }

  protected updateNextAnimation() {}

  public updateNextState() {
    this.computeAndUpdateNextPos()
    this.updateNextAnimation()
    this.updateNextTick()
  }
}

// デフォルト引数は全画面表示
const TargetHeart = forwardRef<ISprite, Props>( // eslint-disable-line
  ({ isClickThrough = false, defaultX, defaultY, scale, border }, ref) => {
    const [characterState, setCharacterState] = useState<State>({
      currentPos: { x: defaultX, y: defaultY },
      targetPos: { x: defaultX, y: defaultY },
      currentAnimation: -1,
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

      const mc = new MiniCatCondition(characterState, border)
      mc.updateNextState()
      // mc.stateは内部でディープコピーされている
      setCharacterState(mc.state)
    })

    return (
      <Sprite
        image="/static/img/heart/full-heart.png"
        anchor={0.5}
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
        ref={ref}
      />
    )
  }
)

export default TargetHeart
