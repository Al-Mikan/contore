import React, { ReactNode, createContext, useEffect, useState } from 'react'

import HealthPoint from '../../utils/HealthPoint'
import { getNowYMDhmsStr } from '../../utils/common'
import {
  shouldFetchHP,
  updateCoreHP,
  updateCoreLastLogin,
} from '../../utils/model'
import { NextRouter } from 'next/router'

type Props = {
  children: ReactNode
  router: NextRouter
}

type HealthContextType = {
  health: number
  plusHealth: (n: number) => void
}

export const HealthContext = createContext<HealthContextType>({
  health: -1,
  plusHealth: () => {},
})

const CanvasContext = ({ children, router }: Props) => {
  const [health, setHealth] = useState(-1)
  const plusHealth = (n: number) => {
    setHealth((prev) => {
      const _hp = new HealthPoint(prev)
      _hp.update_health_point(n)
      return _hp.health_point
    })
  }

  useEffect(() => {
    const fetchHealthPoint = async () => {
      setHealth(await shouldFetchHP())
    }

    fetchHealthPoint()

    const timerID = setInterval(() => {
      setHealth((prev: number) => {
        const _hp = new HealthPoint(prev)
        _hp.update_health_point(-1)
        if (_hp.health_point === 0) {
          router.push('/gameover')
        }
        updateCoreHP(_hp.health_point)
        updateCoreLastLogin(getNowYMDhmsStr()) // shutdown対策で毎秒更新
        return _hp.health_point
      })
    }, 1 * 1000)
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
