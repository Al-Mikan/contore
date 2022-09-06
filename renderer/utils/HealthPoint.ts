export default class HealthPoint {
  static MAX_TIME = 24 * 3600 * 4 // 4days
  private _health_point = 0
  private _division: number = 0
  private _blank: number = 0
  private unit: number = 0

  constructor(_division: number, _blank: number, _health_point: number) {
    this.division = _division
    this.blank = _blank
    this.unit = Math.floor(HealthPoint.MAX_TIME / this.division)
    
    var decrease: number = Math.floor(this.blank / this.unit)
    this.health_point = Math.max(this.division - decrease, 0)
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

  get division(): number {
    return this._division
  }

  set division(value: number) {
    if (value < 1) {
      value = 1
    } else {
     this._division = value
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
}