import { useRouter } from 'next/router'
import { InteractionEvent } from 'pixi.js'
import { useContext, useEffect } from 'react'

import EndBtn from '../components/buttons/EndBtn'
import NewGameBtn from '../components/buttons/NewGameBtn'
import DeadMiniCat from '../components/characters/DeadMiniCat'
import { GameContext } from '../components/containers/CanvasContext'
import GameOverText from '../components/texts/GameOverText'
import { getNowYMDhmsStr } from '../utils/common'
import { updateCoreLastLogin } from '../utils/model'

const ConcentratePage = () => {
  const router = useRouter()
  const {
    health,
    plusHealthInStateAndDB,
    coin,
    plusCoinInStateAndDB,
    experiencePoint,
    plusExInStateAndDB,
    fish,
    plusFishInStateAndDB,
    startDate,
    setStartDateInStateAndDB,
  } = useContext(GameContext)

  const handleNewGame = async (event: InteractionEvent) => {
    // デフォルト値に初期化
    await Promise.all([
      plusExInStateAndDB(-experiencePoint), // 0
      plusCoinInStateAndDB(-coin + 30), // 30
      plusHealthInStateAndDB(-health + 4 * 24 * 3600), // 4 * 24 * 3600
      plusFishInStateAndDB(-fish), // 0
      setStartDateInStateAndDB('default'),
      updateCoreLastLogin(getNowYMDhmsStr()),
    ])
    router.push('/')
  }

  const handleEndClick = async (event: InteractionEvent) => {
    await Promise.all([
      plusExInStateAndDB(-experiencePoint), // 0
      plusCoinInStateAndDB(-coin + 30), // 30
      plusHealthInStateAndDB(-health + 4 * 24 * 3600), // 4 * 24 * 3600
      plusFishInStateAndDB(-fish), // 0
      setStartDateInStateAndDB('default'),
      updateCoreLastLogin(getNowYMDhmsStr()),
    ])
    window.electronAPI.closeWindow()
  }

  useEffect(() => {
    window.electronAPI.setAlwaysOnTop(true)

    return () => {
      window.electronAPI.setAlwaysOnTop(false)
    }
  }, [])

  return (
    <>
      <DeadMiniCat x={900} y={1040} isClickThrouth={true} />
      <GameOverText x={900} y={500} scale={1} />
      <NewGameBtn
        x={730}
        y={750}
        scale={0.8}
        handleClick={handleNewGame}
        isClickThrouth={true}
      />
      <EndBtn
        x={810}
        y={840}
        scale={1.5}
        handleClick={handleEndClick}
        isClickThrouth={true}
      />
    </>
  )
}

export default ConcentratePage
