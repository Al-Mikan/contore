import { NextRouter } from 'next/router'
import { InteractionEvent } from 'pixi.js'
import { Sprite, Container } from '@inlet/react-pixi'
import { useEffect, useState, useContext } from 'react'

import LevelBar from '../items/LevelBar'
import MiniCat from '../characters/MiniCat'
import LifeGauge from '../items/LifeGauge'
import Coin from '../items/Coin'
import TitleBar from '../items/TitleBar'
import { Position } from '../../types/character'
import { containsPointClickThrouth } from '../../utils/PixiAPI'
import StartBtn from '../buttons/StartBtn'
import SettingBtn from '../buttons/SettingBtn'
import ExperiencePoint from '../../utils/ExperiencePoint'
import NumText from '../items/NumText'
import {
  shouldFetchExperience,
  shouldFetchCoins,
  shouldFetchFish,
} from '../../utils/model'
import Fish from '../items/Fish'
import { HealthContext } from '../containers/CanvasContext'
import HealthPoint from '../../utils/HealthPoint'

interface Props {
  router: NextRouter
}

const Home = ({ router }: Props) => {
  const { health } = useContext(HealthContext)
  const [pos, setPos] = useState<Position>({ x: 350, y: 200 })
  const [experience, setExperience] = useState(0)
  const [coins, setCoins] = useState(0)
  const [fish, setFish] = useState(0)
  const [minicatScale, setMinicatScale] = useState(0.4)

  const ex = new ExperiencePoint(experience)
  const hp = new HealthPoint(health)

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
    const stateInitExperience = async () => {
      setExperience(await shouldFetchExperience())
    }
    const stateInitCoins = async () => {
      setCoins(await shouldFetchCoins())
    }
    const stateInitFish = async () => {
      setFish(await shouldFetchFish())
    }
    // 非同期処理を並行に実行
    stateInitExperience()
    stateInitCoins()
    stateInitFish()
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
        image={'/static/img/background.png'} // 640 * 360
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
        <Sprite image="/static/img/board.png" x={50} scale={0.5} />
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
        <LifeGauge
          n={hp.get_health_point_formatted(10)}
          x={495}
          y={100}
          scale={0.6}
        />
        <Container x={530} y={135} scale={0.2}>
          <Fish scale={0.2} />
          <NumText n={fish} view_digits={4} x={100} y={-25} />
        </Container>
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
  )
}

export default Home
