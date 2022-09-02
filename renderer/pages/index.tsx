import { useRouter } from 'next/router'
import { InteractionEvent } from 'pixi.js'
import { Sprite } from '@inlet/react-pixi'
import { useState } from 'react'

import Layout from '../components/containers/Layout'
import LevelBar from '../components/items/LevelBar'
import MiniCat from '../components/characters/MiniCat'
import Level from '../components/items/Level'
import LifeGauge from '../components/items/LifeGauge'
import Coin from '../components/items/Coin'
import CoinText from '../components/items/CoinText'
import { Position } from '../types/character'
import { containsPointClickThrouth } from '../utils/pixi_api'
import StartBtn from '../components/buttons/StartBtn'
import SettingBtn from '../components/buttons/SettingBtn'
import EndBtn from '../components/buttons/EndBtn'

const IndexPage = () => {
  const router = useRouter()
  const [dragMode, setDragMode] = useState(false)
  const [pos, setPos] = useState<Position>({ x: 350, y: 200 })
  const [beforeMousePos, setBeforeMousePos] = useState<Position>({ x: 0, y: 0 })
  // 背景画像のサイズを元に調整する
  const miniCatBorder = {
    minX: 0 - 50,
    maxX: 640 + 50,
    minY: 0,
    maxY: 293,
    randomTargetMinX: 0 - 10,
    randomTargetMaxX: 640 + 10,
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
          defaultY={293}
          scale={0.5}
          border={miniCatBorder}
        />
        <Sprite image="/img/board.png" x={50} scale={0.5} />
        <LevelBar n={4} x={440} y={20} scale={0.7} />
        <Level level={20} x={560} y={23} scale={0.2} />
        <Coin x={320} y={30} scale={0.3} />
        <CoinText n={180} x={350} y={23} scale={0.3} />
        <LifeGauge n={3} x={450} y={60} scale={0.8} />
        <SettingBtn
          handleSettingClick={handleSettingClick}
          x={595}
          y={13}
          scale={0.4}
        />
        <StartBtn
          handleStartClick={handleStartClick}
          x={400}
          y={315}
          scale={0.8}
        />
        <EndBtn handleClick={handleEndClick} x={520} y={315} scale={0.8} />
      </Sprite>
    </Layout>
  )
}

export default IndexPage
