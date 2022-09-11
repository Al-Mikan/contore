import { useRouter } from 'next/router'
import { InteractionEvent } from 'pixi.js'
import { useEffect } from 'react'

import EndBtn from '../components/buttons/EndBtn'
import NewGameBtn from '../components/buttons/NewGameBtn'
import DeadMiniCat from '../components/characters/DeadMiniCat'
import GameOverText from '../components/texts/GameOverText'
import { getNowYMDhmsStr } from '../utils/common'
import {
  updateCoreCoin,
  updateCoreEX,
  updateCoreHP,
  updateCoreLastLogin,
  updateShopFish,
} from '../utils/model'

const ConcentratePage = () => {
  const router = useRouter()

  const handleNewGame = async (event: InteractionEvent) => {
    await Promise.all([
      updateCoreEX(0),
      updateCoreCoin(30),
      updateCoreHP(96 * 3600),
      updateCoreLastLogin(getNowYMDhmsStr()),
      updateShopFish(0),
    ])
    router.push('/')
  }

  const handleEndClick = async (event: InteractionEvent) => {
    await Promise.all([
      updateCoreEX(0),
      updateCoreCoin(30),
      updateCoreHP(96 * 3600),
      updateCoreLastLogin(getNowYMDhmsStr()),
      updateShopFish(0),
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
