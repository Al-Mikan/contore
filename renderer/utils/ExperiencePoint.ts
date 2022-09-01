export default class ExperiencePoint {
  static MAX_LEVEL: number = 100
  static START_POINT: number = 600
  static DIFFERENCE: number = 60
  private _experience_point: number = 0
  public accumulate = Array(ExperiencePoint.MAX_LEVEL + 2)

  /*
    accumulate[i]: レベルi時点での経験値
    accumulate[MAX_LEBEL]: 100時間 <- sum(i = 0 ~ MAX_LEBEL) START_POINT + DIFFERENCE * i
  */

  constructor(_experience_point: number) {
    this.accumulate[0] = 0
    for (var i = 0; i <= ExperiencePoint.MAX_LEVEL; i++) {
      const now = ExperiencePoint.START_POINT + i * ExperiencePoint.DIFFERENCE
      this.accumulate[i + 1] = this.accumulate[i] + now
    }
    this.experience_point = _experience_point
  }

  // 現在の経験値の取得
  get experience_point(): number {
    return this._experience_point
  }

  set experience_point(value: number) {
    if (value < 0) {
      this._experience_point = 0
    } else if (value > this.accumulate[ExperiencePoint.MAX_LEVEL]) {
      this._experience_point = this.accumulate[ExperiencePoint.MAX_LEVEL]
    } else {
      this._experience_point = value
    }
  }

  // プレイヤーの現在のレべルを取得
  get_level(): number {
    var res: number = 0
    for (var i = 0; i <= ExperiencePoint.MAX_LEVEL; i++) {
      if (this.accumulate[i] <= this.experience_point) {
        res = i
      }
    }

    return res
  }

  // 次のレベルまでに必要な経験値
  next_level(): number {
    var now = this.get_level()
    if (now === ExperiencePoint.MAX_LEVEL) {
      return 0
    } else {
      return this.accumulate[now + 1] - this.experience_point
    }
  }

  // 次のレベルまで何等分進んだか
  progress(division: number): number {
    var level = this.get_level()
    if (level === ExperiencePoint.MAX_LEVEL) return division
    var all = (this.accumulate[level + 1] - this.accumulate[level]) / division
    var now = this.experience_point - this.accumulate[level]
    return Math.floor(now / all)
  }

  // 入力された時間を経験値に変換して加算し、経験値を返す
  // time: 集中時間(秒)
  add_point(time: number): number {
    this.experience_point = this.experience_point + time
    return this.experience_point
  }
}
