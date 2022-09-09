import { useEffect } from 'react'

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

const ConcentratePage = () => {
  const router = useRouter()

  const newGame = async () => {
    await Promise.all([
      updateCoreEX(0),
      updateCoreCoin(0),
      updateCoreHP(96 * 3600),
      updateCoreLastLogin(getNowYMDhmsStr()),
      updateShopFish(0),
    ])
    router.push('/')
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
      <GameOverText x={900} y={600} scale={1} />
    </Layout>
  )
}

export default ConcentratePage
