export default class HealthPoint {
  static MAX_TIME = 24 * 3600 * 4 // 4days
  private _health_point = 0
  private _blank: number = 0

  constructor(_blank: number, _health_point: number) {
    this.blank = _blank
    this.health_point = _health_point
  }

  get health_point(): number {
    return this._health_point
  }

  set health_point(value: number) {
    if (value < 0) {
      this._health_point = 0
    } else if (value > HealthPoint.MAX_TIME) {
      this._health_point = HealthPoint.MAX_TIME
    } else {
      this._health_point = value
    }
  }

  get blank(): number {
    return this._blank
  }

  set blank(value: number) {
    this._blank = value
  }

  recover(recover_point: number) {
    this.health_point = this.health_point + recover_point
  }

  get_health_point_formatted(division: number) {
    if (this.health_point === 0) return 0

    var unit = Math.floor(HealthPoint.MAX_TIME / division)
    var decrease: number = Math.floor(this.blank / unit)
    return Math.max(division - decrease, 0)
  } 
}