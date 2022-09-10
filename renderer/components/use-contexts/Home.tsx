import { NextRouter } from 'next/router'
import { InteractionEvent, TextStyle } from 'pixi.js'
import { Sprite, Container, Graphics, PixiRef, Text } from '@inlet/react-pixi'
import { useEffect, useState, useContext, useRef } from 'react'

import LevelBar from '../items/LevelBar'
import MiniCat from '../characters/MiniCat'
import LifeGauge from '../items/LifeGauge'
import Coin from '../items/Coin'
import TitleBar from '../items/TitleBar'
import { Position } from '../../types/character'
import { containsPointClickThrouth } from '../../utils/PixiAPI'
import StartBtn from '../buttons/StartBtn'
import ShopBtn from '../buttons/ShopBtn'
import OptionBtn from '../buttons/OptionBtn'
import ExperiencePoint from '../../utils/ExperiencePoint'
import NumText from '../items/NumText'
import CodeText from '../texts/CodeText'
import Mask from '../items/Mask'
import {
  shouldFetchExperience,
  shouldFetchCoins,
  shouldFetchFish,
} from '../../utils/model'
import CuteFish from '../items/CuteFish'
import { HealthContext } from '../containers/CanvasContext'
import HealthPoint from '../../utils/HealthPoint'
import PlayBtn from '../buttons/PlayBtn'
import getPlayTime from '../../utils/common'

type IGraphics = PixiRef<typeof Graphics>

interface Props {
  router: NextRouter
}

const Home = ({ router }: Props) => {
  const { health } = useContext(HealthContext)
  const maskRef = useRef<IGraphics>(null)
  const [pos, setPos] = useState<Position>({ x: 350, y: 200 })
  const [experience, setExperience] = useState(0)
  const [coins, setCoins] = useState(0)
  const [fish, setFish] = useState(0)
  const [minicatScale, setMinicatScale] = useState(0.7)
  const [playTime, setPlayTime] = useState(0)

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
      setPlayTime(getPlayTime(startDate_))
    }

    // 非同期処理を並行に実行
    stateInitExperience()
    stateInitCoins()
    stateInitFish()
    fetchStartDate()
  }, [])

  return (
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
        image={'/static/img/background.png'} // 1600 × 900
        width={1280}
        height={720}
        interactive={true}
        containsPoint={containsPointClickThrouth}
      >
        <Container x={715} y={100} mask={maskRef.current}>
          <Mask width={400} height={508} ref={maskRef} />
          <CodeText />
        </Container>
        <Container x={1230} y={110} scale={1}>
          <LevelBar n={ex.progress(10)} scale={1} />
          <NumText
            n={ex.get_level()}
            view_digits={3}
            x={180}
            y={0}
            scale={0.5}
            is_headzero_displayed={true}
          />
        </Container>
        <Container x={1370} y={200} scale={0.6}>
          <Coin scale={0.8} />
          <NumText n={coins} view_digits={4} x={30} y={-20} scale={0.8} />
        </Container>
        <LifeGauge
          n={hp.get_health_point_formatted(10)}
          x={1270}
          y={250}
          scale={1.2}
        />
        <Container x={1300} y={350} scale={0.6}>
          <CuteFish x={40} y={8} scale={0.5} />
          <NumText n={fish} view_digits={4} x={100} y={-25} />
        </Container>
        <Sprite image="/static/img/board.png" x={40} scale={0.8} />
        <Sprite image="/static/img/days.png" x={300} y={190} scale={0.5} />
        <NumText
          is_headzero_displayed={false}
          x={100}
          y={175}
          scale={0.75}
          n={playTime}
          view_digits={5}
        />

        <OptionBtn
          handleSettingClick={handleSettingClick}
          x={20}
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
      </Sprite>
    </Container>
  )
}

export default Home
