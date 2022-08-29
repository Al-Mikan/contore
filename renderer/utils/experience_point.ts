export default class experience_point {
  exp_point: number = 0
  times = Array(101)
  acc = Array(102)

  constructor() {
    // electron-storeから引っ張ってくる
    this.exp_point = database.read('experience_point')
    for (var i = 0; i <= 100; i++) {
      this.times[i] = 600 + i * 60
      this.acc[i + 1] = this.acc[i] + this.times[i]
    }
  }

  // プレイヤーの現在のレべルを取得
  get_level(): number {
    var res: number = 0
    for (var i = 0; i <= 100; i++) {
      if (this.acc[i] <= this.exp_point) {
        res = i
      }
    }

    return res
  }

  // 入力された時間を経験値に変換して加算
  // time : 集中時間(秒)
  add_point(time: number) {
    var exp = this.time_to_point(time)
    this.exp_point += exp

    // exp_pointをデータベースに格納する
    database.update('experience_point', this.exp_point)
  }

  // 時間を経験値に変換
  time_to_point(time: number): number {
    var time_minute: number = time / 60
    var time_point: number = Math.max(0, time_minute - 10)
    return time_point
  }
}
