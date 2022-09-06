export default class HealthPoint {
  static MAX_TIME = 24 * 3600 * 4 // 4days
  private _health_point = 0

  constructor(_health_point: number) {
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

  get_health_point_formatted(division: number): number {
    if (this.health_point === 0) return 0

    var unit = Math.floor(HealthPoint.MAX_TIME / division)
    return Math.floor(this.health_point / unit)
  }

  update_health_point(value: number): number {
    this.health_point = this.health_point + value
    return this.health_point
  }
}