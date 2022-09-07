import { useRouter } from 'next/router'
import { InteractionEvent } from 'pixi.js'
import { Sprite, Container } from '@inlet/react-pixi'
import { useEffect, useState } from 'react'

import Layout from '../components/containers/Layout'
import LevelBar from '../components/items/LevelBar'
import MiniCat from '../components/characters/MiniCat'
import LifeGauge from '../components/items/LifeGauge'
import Coin from '../components/items/Coin'
import TitleBar from '../components/items/TitleBar'
import { Position } from '../types/character'
import { containsPointClickThrouth } from '../utils/PixiAPI'
import StartBtn from '../components/buttons/StartBtn'
import SettingBtn from '../components/buttons/SettingBtn'
import ExperiencePoint from '../utils/ExperiencePoint'
import NumText from '../components/items/NumText'

const IndexPage = () => {
  const router = useRouter()
  const [pos, setPos] = useState<Position>({ x: 350, y: 200 })
  const [experience, setExperience] = useState(0)
  const [coins, setCoins] = useState(0)
  const [minicatScale, setMinicatScale] = useState(0.4)

  const ex = new ExperiencePoint(experience)
  // 背景画像のサイズを元に調整する
  const miniCatBorder = {
    minX: 0 + 20,
    maxX: 640 - 20,
    minY: 20 + (minicatScale - 0.5) * 45, // スケール調整時に浮かないように
    maxY: 360 - 40 - (minicatScale - 0.5) * 45,
    randomTargetMinX: 0 + 20,
    randomTargetMaxX: 640 - 20,
  }

  const handleStartClick = (event: InteractionEvent) => {
    router.push('/concentrate')
  }
  const handleSettingClick = (event: InteractionEvent) => {
    router.push('/setting')
  }

  const handlePlayClick = (event: InteractionEvent) => {
    router.push('/play')
  }
  const handleShopClick = (event: InteractionEvent) => {
    router.push('/shop')
  }

  const handleCloseClick = (event: InteractionEvent) => {
    window.electronAPI.closeWindow()
  }

  useEffect(() => {
    const fetchExperience = async () => {
      // 経験値の設定
      const nowEx: number = await window.database.read('core.experience_point')
      if (nowEx === undefined) {
        throw new Error('electron-store: core.experience_pointが存在しません')
      }
      setExperience(nowEx)
    }
    const fetchCoins = async () => {
      // コイン枚数の設定
      const nowCoins: number = await window.database.read('core.coin')
      if (nowCoins === undefined) {
        throw new Error('electron-store: core.coinが存在しません')
      }
      setCoins(nowCoins)
    }

    // 非同期処理を並行に実行
    fetchExperience()
    fetchCoins()
  }, [])

  return (
    <Layout title="Home | こんとれ！！">
      <Container x={pos.x} y={pos.y}>
        <TitleBar
          y={-39}
          width={1280}
          setParentPos={(pos: Position) => {
            setPos(pos)
          }}
          handleCloseBtn={handleCloseClick}
        />
        <Sprite
          image={'/img/background.png'} // 640 * 360
          width={1280}
          height={720}
          interactive={true}
          containsPoint={containsPointClickThrouth}
        >
          <MiniCat
            defaultX={200}
            defaultY={miniCatBorder.maxY}
            scale={minicatScale}
            border={miniCatBorder}
            isClickThrough={true} // 画面外でも正常にクリック可能に
          />
          <Sprite image="/img/board.png" x={50} scale={0.5} />
          <Container x={500} y={50} scale={0.6}>
            <LevelBar n={ex.progress(10)} scale={0.7} />
            <NumText
              n={ex.get_level()}
              view_digits={3}
              x={120}
              y={3}
              scale={0.2}
              is_headzero_displayed={true}
            />
          </Container>
          <Container x={540} y={80} scale={0.6}>
            <Coin scale={0.3} />
            <NumText n={coins} view_digits={4} x={30} y={-7} scale={0.3} />
          </Container>
          <LifeGauge n={3} x={530} y={100} scale={0.6} />
          <SettingBtn
            handleSettingClick={handleSettingClick}
            x={595}
            y={13}
            scale={0.4}
          />
          <StartBtn
            handleStartClick={handleStartClick}
            x={530}
            y={305}
            scale={0.8}
          />
          <StartBtn
            handleStartClick={handlePlayClick}
            x={530}
            y={250}
            scale={0.8}
          />
          <StartBtn
            handleStartClick={handleShopClick}
            x={430}
            y={305}
            scale={0.8}
          />
        </Sprite>
      </Container>
    </Layout>
  )
}

export default IndexPage
