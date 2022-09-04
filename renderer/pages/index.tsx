import { useRouter } from 'next/router'
import { InteractionEvent } from 'pixi.js'
import { Sprite, Container } from '@inlet/react-pixi'
import { useEffect, useState } from 'react'

import Layout from '../components/containers/Layout'
import LevelBar from '../components/items/LevelBar'
import MiniCat from '../components/characters/MiniCat'
import LifeGauge from '../components/items/LifeGauge'
import Coin from '../components/items/Coin'
import { Position } from '../types/character'
import { containsPointClickThrouth } from '../utils/PixiAPI'
import StartBtn from '../components/buttons/StartBtn'
import SettingBtn from '../components/buttons/SettingBtn'
import ExperiencePoint from '../utils/ExperiencePoint'
import NumText from '../components/items/NumText'
import QuitBtn from '../components/buttons/QuitBtn'

const IndexPage = () => {
  const router = useRouter()
  const [dragMode, setDragMode] = useState(false)
  const [pos, setPos] = useState<Position>({ x: 350, y: 200 })
  const [beforeMousePos, setBeforeMousePos] = useState<Position>({ x: 0, y: 0 })
  const [experience, setExperience] = useState(0)
  const [coins, setCoins] = useState(0)

  const ex = new ExperiencePoint(experience)
  // 背景画像のサイズを元に調整する
  const miniCatBorder = {
    minX: 0 + 20,
    maxX: 640 - 20,
    minY: 15,
    maxY: 320,
    randomTargetMinX: 0 + 20,
    randomTargetMaxX: 640 - 20,
  }

  const handleStartClick = (event: InteractionEvent) => {
    router.push('/concentrate')
  }
  const handleSettingClick = (event: InteractionEvent) => {
    router.push('/setting')
  }
  const handleEndClick = (event: InteractionEvent) => {
    electronAPI.closeWindow()
  }

  // ドラッグ操作
  const mouseDown = (event: InteractionEvent) => {
    const nx = event.data.global.x
    const ny = event.data.global.y
    setDragMode(true)
    setBeforeMousePos({ x: nx, y: ny })
  }

  const mouseMove = (event: InteractionEvent) => {
    if (!dragMode) return
    /* currentTargetがnullのバグが発生したので条件分岐する */
    if (event.currentTarget === null || event.currentTarget === undefined)
      return
    /* クリックした場所から移動した差だけ移動する */
    /* nx,nyにセットすると、端っこをクリックすると始め瞬間移動するので必要 */
    const nx = event.data.global.x
    const ny = event.data.global.y
    const currentCharacterPosX = event.currentTarget.x
    const currentCharacterPosY = event.currentTarget.y
    setPos({
      x: currentCharacterPosX + (nx - beforeMousePos.x),
      y: currentCharacterPosY + (ny - beforeMousePos.y),
    })
    setBeforeMousePos({ x: nx, y: ny })
  }

  const mouseUp = (event: InteractionEvent) => {
    setDragMode(false)
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
      <Sprite
        image={'/img/background.png'} // 640 * 360
        x={pos.x}
        y={pos.y}
        width={1280}
        height={720}
        interactive={true}
        containsPoint={containsPointClickThrouth}
        mousedown={mouseDown}
        mousemove={mouseMove}
        mouseup={mouseUp}
        mouseupoutside={mouseUp}
      >
        <MiniCat
          defaultX={200}
          defaultY={320}
          scale={0.5}
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
        <QuitBtn handleClick={handleEndClick} x={20} y={305} scale={0.4} />
      </Sprite>
    </Layout>
  )
}

export default IndexPage
