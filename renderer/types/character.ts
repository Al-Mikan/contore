export type MiniCatAnimation = 0 | 1 | 2 | 3

export interface Position {
  x: number
  y: number
}

export interface State {
  currentPos: Position // 現在位置
  targetPos: Position // 最終的な目標位置 (次フレームの位置ではない)
  vx: number // x軸方向の速度
  vy: number
  angle: number
  currentAnimation: MiniCatAnimation
  moveTick: number
  dragMode: boolean
}
