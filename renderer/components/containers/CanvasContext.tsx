import React, { ReactNode, createContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import HealthPoint from '../../utils/HealthPoint'
import { getNowYMDhmsStr } from '../../utils/common'
import {
  shouldFetchHP,
  updateCoreHP,
  updateCoreLastLogin,
} from '../../utils/model'

type Props = {
  children: ReactNode
}

type HealthContextType = {
  health: number
  plusHealth: (n: number) => void
}

export const HealthContext = createContext<HealthContextType>({
  health: -1,
  plusHealth: () => {},
})

const CanvasContext = ({ children }: Props) => {
  const router = useRouter()
  const [health, setHealth] = useState(-1)
  const plusHealth = (n: number) => {
    setHealth((prev) => {
      const hp = new HealthPoint(prev)
      hp.update_health_point(n)
      return hp.health_point
    })
  }

  useEffect(() => {
    const intervalMillSec = 1000
    const fetchHealthPoint = async () => {
      setHealth(await shouldFetchHP())
    }

    fetchHealthPoint()

    const timerID = setInterval(() => {
      setHealth((prev: number) => {
        const hp = new HealthPoint(prev)
        hp.update_health_point(-1)
        if (hp.health_point === 0) {
          router.push('/gameover')
        }
        updateCoreHP(hp.health_point)
        updateCoreLastLogin(getNowYMDhmsStr()) // shutdown対策で毎秒更新
        return hp.health_point
      })
    }, intervalMillSec)
    return () => {
      clearInterval(timerID)
    }
  }, [])

  return (
    <HealthContext.Provider
      value={{
        health: health,
        plusHealth: plusHealth,
      }}
    >
      {children}
    </HealthContext.Provider>
  )
}

export default CanvasContext
