import { useEffect } from 'react'
import { InteractionEvent } from 'pixi.js'

import NewGameBtn from '../components/buttons/NewGameBtn'
import GameOverText from '../components/texts/GameOverText'
import Layout from '../components/containers/Layout'
import { useRouter } from 'next/router'
import { getNowYMDhmsStr } from '../utils/api'
import {
  updateCoreCoin,
  updateCoreEX,
  updateCoreHP,
  updateCoreLastLogin,
  updateShopFish,
} from '../utils/model'
import DeadMiniCat from '../components/characters/DeadMiniCat'
import EndBtn from '../components/buttons/EndBtn'

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
    <Layout title="ゲームオーバー | こんとれ！！">
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
    </Layout>
  )
}

export default ConcentratePage
