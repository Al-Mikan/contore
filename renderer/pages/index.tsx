import { Container } from '@inlet/react-pixi'
import { useRouter } from 'next/router'
import { InteractionEvent } from 'pixi.js'
import { useContext, useEffect, useState } from 'react'

import OptionBtn from '../components/buttons/OptionBtn'
import PlayBtn from '../components/buttons/PlayBtn'
import ShopBtn from '../components/buttons/ShopBtn'
import StartBtn from '../components/buttons/StartBtn'
import MiniCat from '../components/characters/MiniCat'
import { GameContext } from '../components/containers/CanvasContext'
import BackGround from '../components/items/BackGround'
import Board from '../components/items/CorkBoard'
import StatusBox from '../components/items/StatusBox'
import TitleBar from '../components/items/TitleBar'
import Black from '../components/items/black'
import ReceiveCatModal from '../components/modals/ReceiveCatModal'
import SettingModal from '../components/modals/SettingModal'
import ShopModal from '../components/modals/ShopModal'
import { Position } from '../types/character'
import { getNowYMDhmsStr } from '../utils/common'

const IndexPage = () => {
  const router = useRouter()
  const { startDate } = useContext(GameContext)
  const [windowPosition, setWindowPosition] = useState<Position>({
    x: 350,
    y: 200,
  })
  const [minicatScale, setMinicatScale] = useState(0.7)
  const [isShop, setIsShop] = useState(false)
  const [isSetting, setIsSetting] = useState(false)
  const [isBlack, setIsBlack] = useState(false)
  const [playTime, setPlayTime] = useState(0)
  const [isFirstLogin, setIsFirstLogin] = useState(false)

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

  useEffect(() => {
    if (startDate === 'default') {
      setIsBlack(true)
      setIsFirstLogin(true)
      window.database.update('core.start_date', getNowYMDhmsStr())
    }
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
        <StatusBox x={1170} y={180} />
        <Board x={50} scale={0.8} />
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
