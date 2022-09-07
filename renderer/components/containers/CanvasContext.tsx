import React, { ReactNode, createContext, useEffect, useState } from 'react'

import HealthPoint from '../../utils/HealthPoint'

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
      // HPの設定
      const nowHP: number = await window.database.read('core.health_point')
      if (nowHP === undefined) {
        throw new Error('electron-store: core.health_pointが存在しません')
      }
      setHealth(nowHP)
    }

    fetchHealthPoint()

    const timerID = setInterval(() => {
      setHealth((prev: number) => {
        let _hp = new HealthPoint(prev)
        _hp.update_health_point(-1)
        if (_hp.health_point === 0) {
          console.log('gameover')
        }
        window.database.update('core.health_point', _hp.health_point)
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
