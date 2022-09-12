import { useRouter } from 'next/router'
import React, { ReactNode, createContext } from 'react'

import useHealth from '../../hooks/useHealth'

type Props = {
  children: ReactNode
}

type GameContextType = {
  health: number
  plusHealthInStateAndDB: (n: number) => Promise<void>
  coin: number
  plusCoinInStateAndDB: (n: number) => Promise<void>
  experiencePoint: number
  plusExInStateAndDB: (n: number) => Promise<void>
  fish: number
  plusFishInStateAndDB: (n: number) => Promise<void>
}

export const GameContext = createContext<GameContextType>({
  health: -1,
  plusHealthInStateAndDB: async () => {},
  coin: -1,
  plusCoinInStateAndDB: async () => {},
  experiencePoint: -1,
  plusExInStateAndDB: async () => {},
  fish: -1,
  plusFishInStateAndDB: async () => {},
})

const CanvasContext = ({ children }: Props) => {
  const router = useRouter()
  const [health, plusHealthInStateAndDB] = useHealth()

  const isLoading = health === -1

  if (isLoading) {
    return null
  }

  // gameover処理
  if (health === 0) {
    router.push('/gameover')
  }

  return (
    <GameContext.Provider
      value={{
        health: health,
        plusHealthInStateAndDB: plusHealthInStateAndDB,
        coin: -1,
        plusCoinInStateAndDB: async () => {},
        experiencePoint: -1,
        plusExInStateAndDB: async () => {},
        fish: -1,
        plusFishInStateAndDB: async () => {},
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export default CanvasContext
