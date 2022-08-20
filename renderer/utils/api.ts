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
