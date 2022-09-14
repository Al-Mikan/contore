import { useEffect, useState } from 'react'

import HealthPoint from '../utils/HealthPoint'
import { getNowYMDhmsStr } from '../utils/common'
import {
  shouldFetchHP,
  updateCoreHP,
  updateCoreLastLogin,
} from '../utils/model'

const useHealth = (): [number, (n: number) => Promise<void>] => {
  const [health, setHealth] = useState(-1)
  const plusHealthInStateAndDB = async (n: number) => {
    setHealth((prev) => {
      const hp = new HealthPoint(prev)
      hp.update_health_point(n)
      updateCoreHP(hp.health_point)
      return hp.health_point // TODO: DBの更新を終えてからStateの更新をする
    })
  }

  useEffect(() => {
    const intervalMillSec = 1000
    let timerID
    const fetchHealthPoint = async () => {
      setHealth(await shouldFetchHP())
      timerID = setInterval(() => {
        setHealth((prev: number) => {
          const hp = new HealthPoint(prev)
          hp.update_health_point(-1)
          updateCoreHP(hp.health_point)
          updateCoreLastLogin(getNowYMDhmsStr()) // shutdown対策で毎秒更新
          return hp.health_point // TODO: DBの更新を終えてからStateの更新をする
        })
      }, intervalMillSec)
    }
    fetchHealthPoint()

    return () => {
      if (timerID) clearInterval(timerID)
    }
  }, [])

  return [health, plusHealthInStateAndDB]
}

export default useHealth
