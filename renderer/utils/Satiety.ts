export default class Satity {
  static MAX_TIME = 259200 // 72h
  private _division: number = 0
  private _blank: number = 0
  private _unit: number = 0

  constructor(_division: number, _blank: number) {
    this.division = _division
    this.blank = _blank
    this.unit = Math.floor(Satity.MAX_TIME / this.division)
  }

  get division(): number {
    return this._division
  }

  set division(value: number) {
    this._division = value
  }

  get blank(): number {
    return this._division
  }

  set blank(value: number) {
    this._blank = value
  }

  get unit(): number {
    return this._unit
  }

  set unit(value: number) {
    this._unit = value
  }

  get_satiety(): number {
    var decrease: number = Math.floor(this.blank / this.unit)
    return this.division - decrease
  }
}