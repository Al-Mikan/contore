import { useRouter } from 'next/router'
import React, { ReactNode, createContext } from 'react'

import useCoin from '../../hooks/useCoin'
import useExperience from '../../hooks/useExperience'
import useFish from '../../hooks/useFish'
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
  const [coin, plusCoinInStateAndDB] = useCoin()
  const [experiencePoint, plusExInStateAndDB] = useExperience()
  const [fish, plusFishInStateAndDB] = useFish()

  const isLoading =
    health === -1 || coin === -1 || experiencePoint === -1 || fish === -1

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
        coin: coin,
        plusCoinInStateAndDB: plusCoinInStateAndDB,
        experiencePoint: experiencePoint,
        plusExInStateAndDB: plusExInStateAndDB,
        fish: fish,
        plusFishInStateAndDB: plusFishInStateAndDB,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export default CanvasContext
