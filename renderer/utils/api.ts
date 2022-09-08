/* 
   sample.test.tsのtype-checkが通るように作成
   別の関数が追加されたら書き換える
 */
export const sampleFunction = () => {
  return 0
}

export function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min) //The maximum is exclusive and the minimum is inclusive
}

export const shouldStrToNum = (nStr: string) => {
  const n = Number(nStr)
  if (isNaN(n)) throw new Error('非数値の文字は数値に変換できません')
  return n
}

// strTime: 00:00:00の形式
export const shouldStrTimeToSecondNum = (strTime: string) => {
  if (strTime.length !== 8 || strTime[2] !== ':' || strTime[5] !== ':') {
    throw new Error('非対応フォーマットの時間表示です')
  }
  const h = 10 * shouldStrToNum(strTime[0]) + shouldStrToNum(strTime[1])
  const m = 10 * shouldStrToNum(strTime[3]) + shouldStrToNum(strTime[4])
  const s = 10 * shouldStrToNum(strTime[6]) + shouldStrToNum(strTime[7])
  return 60 * 60 * h + 60 * m + s
}

export function getNowYMDhmsStr() {
  const date = new Date()
  const Y = date.getFullYear()
  const M = ('00' + (date.getMonth() + 1)).slice(-2)
  const D = ('00' + date.getDate()).slice(-2)
  const h = ('00' + date.getHours()).slice(-2)
  const m = ('00' + date.getMinutes()).slice(-2)
  const s = ('00' + date.getSeconds()).slice(-2)

  return Y + '-' + M + '-' + D + 'T' + h + ':' + m + ':' + s
}
