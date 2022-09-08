import React, { ReactNode, createContext, useEffect, useState } from 'react'

import HealthPoint from '../../utils/HealthPoint'
import { getNowYMDhmsStr } from '../../utils/api'
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
}

export const HealthContext = createContext<HealthContextType>({
  health: -1,
})

const CanvasContext = ({ children }: Props) => {
  const [health, setHealth] = useState(-1)

  useEffect(() => {
    const fetchHealthPoint = async () => {
      setHealth(await shouldFetchHP())
    }

    fetchHealthPoint()

    const timerID = setInterval(() => {
      setHealth((prev: number) => {
        let _hp = new HealthPoint(prev)
        _hp.update_health_point(-1)
        if (_hp.health_point === 0) {
          console.log('gameover')
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
      }}
    >
      {children}
    </HealthContext.Provider>
  )
}

export default CanvasContext
