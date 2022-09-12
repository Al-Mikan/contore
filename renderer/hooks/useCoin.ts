import { useEffect, useState } from 'react'

import { shouldFetchCoins, updateCoreCoin } from '../utils/model'

const useCoin = (): [number, (n: number) => Promise<void>] => {
  const [coin, setCoin] = useState(-1)
  const plusCoinInStateAndDB = async (n: number) => {
    setCoin((prev) => {
      if (prev + n < 0)
        throw new Error(
          'System Error: コインの枚数をDBに0未満での保存を試みています'
        )
      updateCoreCoin(prev + n)
      return prev + n // TODO: DBの更新を終えてからStateの更新をする
    })
  }

  useEffect(() => {
    const fetchCoin = async () => {
      setCoin(await shouldFetchCoins())
    }
    fetchCoin()
  }, [])

  return [coin, plusCoinInStateAndDB]
}

export default useCoin
