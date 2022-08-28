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
