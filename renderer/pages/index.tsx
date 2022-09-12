import { Container, Sprite } from '@inlet/react-pixi'
import { useRouter } from 'next/router'
import { InteractionEvent } from 'pixi.js'
import { useContext, useEffect, useState } from 'react'

import OptionBtn from '../components/buttons/OptionBtn'
import PlayBtn from '../components/buttons/PlayBtn'
import ShopBtn from '../components/buttons/ShopBtn'
import StartBtn from '../components/buttons/StartBtn'
import MiniCat from '../components/characters/MiniCat'
import { HealthContext } from '../components/containers/CanvasContext'
import BackGround from '../components/items/BackGround'
import Coin from '../components/items/Coin'
import CuteFish from '../components/items/CuteFish'
import Level from '../components/items/Level'
import LevelBar from '../components/items/LevelBar'
import LifeGauge from '../components/items/LifeGauge'
import NumText from '../components/items/NumText'
import TitleBar from '../components/items/TitleBar'
import Black from '../components/items/black'
import ReceiveCatModal from '../components/modals/ReceiveCatModal'
import SettingModal from '../components/modals/SettingModal'
import ShopModal from '../components/modals/ShopModal'
import { Position } from '../types/character'
import ExperiencePoint from '../utils/ExperiencePoint'
import HealthPoint from '../utils/HealthPoint'
import { getNowYMDhmsStr } from '../utils/common'
import { getTotalPlayTimeinDays } from '../utils/common'
import {
  shouldFetchCoins,
  shouldFetchExperience,
  shouldFetchFish,
} from '../utils/model'

const IndexPage = () => {
  const router = useRouter()
  const { health } = useContext(HealthContext)

  const [windowPosition, setWindowPosition] = useState<Position>({
    x: 350,
    y: 200,
  })
  const [experience, setExperience] = useState(0)
  const [coins, setCoins] = useState(0)
  const [fish, setFish] = useState(0)
  const [minicatScale, setMinicatScale] = useState(0.7)
  const [isShop, setIsShop] = useState(false)
  const [isSetting, setIsSetting] = useState(false)
  const [isBlack, setIsBlack] = useState(false)
  const [playTime, setPlayTime] = useState(0)
  const [isFirstLogin, setIsFirstLogin] = useState(false)

  const ex = new ExperiencePoint(experience)
  const hp = new HealthPoint(health)

  // 背景画像のサイズを元に調整する
  // 1600 × 900
  const miniCatBorder = {
    minX: 0 + 20,
    maxX: 1600 - 20,
    minY: 20 + (minicatScale - 0.5) * 45, // スケール調整時に浮かないように
    maxY: 900 - 70 - (minicatScale - 0.5) * 45,
    randomTargetMinX: 0 + 20,
    randomTargetMaxX: 900 - 20,
  }

  const handleStartClick = (event: InteractionEvent) => {
    router.push('/concentrate')
  }

  const shopHandleClickToHome = () => {
    setIsShop(false)
    setIsBlack(false)
  }

  const settingHandleClickToHome = () => {
    setIsSetting(false)
    setIsBlack(false)
  }

  const ReceiveCatHandleClickToHome = () => {
    setIsFirstLogin(false)
    setIsBlack(false)
  }

  const handleSettingClick = (event: InteractionEvent) => {
    setIsSetting(true)
    setIsBlack(true)
  }

  const handlePlayClick = (event: InteractionEvent) => {
    router.push('/feed')
  }
  const handleShopClick = (event: InteractionEvent) => {
    setIsShop(true)
    setIsBlack(true)
  }

  useEffect(() => {
    const stateInitExperience = async () => {
      setExperience(await shouldFetchExperience())
    }
    const stateInitCoins = async () => {
      setCoins(await shouldFetchCoins())
    }
    const stateInitFish = async () => {
      setFish(await shouldFetchFish())
    }
    const fetchStartDate = async () => {
      // ログイン日数の設定
      const nowStartDate: string = await window.database.read('core.start_date')
      if (nowStartDate === undefined) {
        throw new Error('electron-store: core.start_dateが存在しません')
      }
      let startDate_ = new Date(nowStartDate)
      setPlayTime(getTotalPlayTimeinDays(startDate_))
    }

    const firstLogin = async () => {
      const nowStartDate: string = await window.database.read('core.start_date')
      if (nowStartDate === 'default') {
        setIsBlack(true)
        setIsFirstLogin(true)
        window.database.update('core.start_date', getNowYMDhmsStr())
      }
    }

    // 非同期処理を並行に実行
    firstLogin().then(() => {
      stateInitExperience()
      stateInitCoins()
      stateInitFish()
      fetchStartDate()
    })
  }, [])

  return (
    <Container x={windowPosition.x} y={windowPosition.y} scale={0.85}>
      <TitleBar
        y={-40}
        setPositionHook={(pos: Position) => {
          setWindowPosition(pos)
        }}
      />
      <BackGround>
        <Container x={1170} y={180} scale={1}>
          <LevelBar n={ex.progress(8)} x={-60} y={-30} scale={0.75} />
          <Level x={130} y={170} scale={0.7} />
          <NumText
            n={ex.get_level()}
            view_digits={3}
            x={80}
            y={140}
            scale={0.65}
            is_headzero_displayed={true}
          />
        </Container>
        <Container x={1150} y={600} scale={0.6}>
          <Coin x={-20} scale={0.8} />
          <NumText n={coins} view_digits={4} x={50} y={-25} scale={0.7} />
        </Container>
        <LifeGauge
          n={hp.get_health_point_formatted(10)}
          x={1200}
          y={510}
          scale={1.2}
        />
        <Container x={1300} y={600} scale={0.6}>
          <CuteFish x={60} y={8} scale={0.4} />
          <NumText n={fish} view_digits={4} x={150} y={-25} scale={0.7} />
        </Container>
        <Sprite image="/static/img/board.png" x={40} scale={0.8} />
        <Sprite image="/static/img/days.png" x={300} y={190} scale={0.5} />
        {/*  一日目からスタート */}
        <NumText x={120} y={171} scale={0.6} n={playTime + 1} view_digits={5} />
        <OptionBtn
          handleSettingClick={handleSettingClick}
          x={60}
          y={782}
          scale={0.6}
        />
        <StartBtn
          handleStartClick={handleStartClick}
          x={1250}
          y={737}
          scale={2.3}
        />
        <PlayBtn handleClick={handlePlayClick} x={1050} y={770} scale={0.75} />
        <ShopBtn handleClick={handleShopClick} x={860} y={770} scale={0.73} />
        <MiniCat
          defaultX={200}
          defaultY={miniCatBorder.maxY}
          scale={minicatScale}
          border={miniCatBorder}
        />
      </BackGround>

      {isBlack && <Black x={350} y={windowPosition.y} />}
      {isShop && (
        <ShopModal x={650} y={300} handleClickToHome={shopHandleClickToHome} />
      )}
      {isSetting && (
        <SettingModal
          x={650}
          y={300}
          handleClickToHome={settingHandleClickToHome}
        />
      )}
      {isFirstLogin && (
        <ReceiveCatModal
          x={650}
          y={300}
          handleClickToHome={ReceiveCatHandleClickToHome}
        />
      )}
    </Container>
  )
}

export default IndexPage
