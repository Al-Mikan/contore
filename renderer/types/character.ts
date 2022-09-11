export interface Position {
  x: number
  y: number
}

export interface Border {
  minX: number
  maxX: number
  minY: number
  maxY: number
  randomTargetMinX: number // ランダム移動の幅
  randomTargetMaxX: number
}

export interface State {
  currentPos: Position // 現在位置
  targetPos: Position // 最終的な目標位置 (次フレームの位置ではない)
  vx: number // x軸方向の速度
  vy: number
  angle: number
  currentAnimation: number
  moveTick: number
}

export abstract class CharacterCondition {
  public border: Border
  public beforeState: State
  public state: State

  constructor(beforState: State, border: Border) {
    this.beforeState = beforState
    this.state = {
      ...beforState,
      currentPos: { ...beforState.currentPos },
      targetPos: { ...beforState.targetPos },
    }
    this.border = border

    if (
      this.border.maxX <= this.border.minX ||
      this.border.maxY <= this.border.minY
    ) {
      throw new Error('CharacterBasic: 不適切なBorderが入力されました')
    }
  }

  protected abstract _updateNextTargetPos()
  protected abstract _judgeWall()
  protected abstract _setNextAngle()
  protected abstract _setNextPosX()
  protected abstract _setNextPosY()

  // 次のポジションを決定する一連の手続き
  protected computeAndUpdateNextPos() {
    this._updateNextTargetPos()
    this._judgeWall()
    this._setNextAngle()
    this._setNextPosX()
    this._setNextPosY()
  }

  protected updateNextAnimation() {}

  protected updateNextTick() {
    /* durationごとにターゲットを変更 */
    const interval = 1000
    this.state.moveTick = (this.state.moveTick + 1) % interval
  }

  public updateNextState() {
    this.computeAndUpdateNextPos()
    this.updateNextAnimation()
    this.updateNextTick()
  }
}
