import { useEffect, useState } from 'react'

import { shouldFetchFish, updateShopFish } from '../utils/model'

const useFish = (): [number, (n: number) => Promise<void>] => {
  const [fish, setFish] = useState(-1)
  const plusFishInStateAndDB = async (n: number) => {
    setFish((prev) => {
      if (prev + n < 0)
        throw new Error(
          'System Error: 魚の個数をDBに0未満での保存を試みています'
        )
      updateShopFish(prev + n)
      return prev + n // TODO: DBの更新を終えてからStateの更新をする
    })
  }

  useEffect(() => {
    const fetchFish = async () => {
      setFish(await shouldFetchFish())
    }
    fetchFish()
  }, [])

  return [fish, plusFishInStateAndDB]
}

export default useFish
