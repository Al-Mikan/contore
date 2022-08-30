import styled from 'styled-components'
import { useRouter } from 'next/router'
import { InteractionEvent } from 'pixi.js'
import { Sprite } from '@inlet/react-pixi'
import { useState } from 'react'

import Canvas from '../components/containers/Canvas'
import Layout from '../components/containers/Layout'
import StartBtn from '../components/buttons/StartBtn'
import LevelBar from '../components/items/LevelBar'
import MiniCat from '../components/characters/MiniCat'
import Level from '../components/items/Level'
import LifeGauge from '../components/items/LifeGauge'
import Coin from '../components/items/Coin'
import CoinText from '../components/items/CoinText'
import { Position } from '../types/character'
import { containsPoint } from '../utils/pixi_api'

const IndexPage = () => {
  const router = useRouter()
  const handleStartClick: (event: InteractionEvent) => void = (event) => {
    router.push('/concentrate')
  }
  const [dragMode, setDragMode] = useState(false)
  const [pos, setPos] = useState<Position>({ x: 400, y: 250 })
  const [beforeMousePos, setBeforeMousePos] = useState<Position>({ x: 0, y: 0 })

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
      <Container>
        <Canvas>
          <Sprite
            image={'/img/background.png'}
            scale={1.7}
            x={pos.x}
            y={pos.y}
            interactive={true}
            containsPoint={containsPoint}
            mousedown={mouseDown}
            mousemove={mouseMove}
            mouseup={mouseUp}
            mouseupoutside={mouseUp}
          >
            <Sprite image="/img/board.png" x={50} scale={0.5} />
            <LevelBar n={4} x={440} y={20} scale={0.8} />
            <Level level={20} x={580} y={23} scale={0.3} />
            <Coin x={320} y={30} scale={0.3} />
            <CoinText n={180} x={350} y={23} scale={0.3} />
            <LifeGauge n={3} x={500} y={60} scale={1} />
            <StartBtn
              handleStartClick={handleStartClick}
              x={500}
              y={290}
              scale={0.8}
            />
            <MiniCat isClickThrough={false} />
          </Sprite>
        </Canvas>
      </Container>
    </Layout>
  )
}

const Container = styled.div`
  background-color: rgba(255, 255, 255, 0);
  width: 100vw;
  height: 100vh;
`

export default IndexPage
