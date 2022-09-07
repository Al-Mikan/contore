import { useEffect, useState, useRef } from 'react'
import { Sprite, PixiRef } from '@inlet/react-pixi'
import { InteractionEvent } from 'pixi.js'

import Layout from '../components/containers/Layout'
import MiniCat from '../components/characters/MiniCat'
import TargetHeart from '../components/characters/TargetHeart'
import EndBtn from '../components/buttons/EndBtn'
import { useRouter } from 'next/router'
import { getRandomInt } from '../utils/api'

type ISprite = PixiRef<typeof Sprite>

const ConcentratePage = () => {
  const router = useRouter()
  const [targetItemScale, setTargetItemScale] = useState(3)
  const [targetVisible, setTargetVisible] = useState(true)
  const spriteRef = useRef<ISprite>(null)
  const [minicatScale, setMinicatScale] = useState(0.6)
  const miniCatBorder = {
    minX: 40,
    maxX: 1900,
    minY: 30 + (minicatScale - 0.8) * 35, // スケール調整時に浮かないように
    maxY: 1050 - (minicatScale - 0.8) * 35,
    randomTargetMinX: 1400,
    randomTargetMaxX: 1620,
  }

  const handleClickToHome = (event: InteractionEvent) => {
    router.push('/')
  }

  useEffect(() => {
    window.electronAPI.setAlwaysOnTop(true)

    return () => {
      window.electronAPI.setAlwaysOnTop(false)
    }
  }, [])

  return (
    <Layout title="集中画面 | こんとれ！！">
      <MiniCat
        isClickThrough={true}
        scale={minicatScale}
        border={miniCatBorder}
        defaultX={950}
        defaultY={miniCatBorder.maxY}
        targetSpriteRef={spriteRef}
        handleTargetCollision={() => {
          if (spriteRef?.current?.width < 20) {
            setTargetVisible(false) // 一度,ターゲットがUnMountされる
            // 一定時間後にハートをもう一度降らせる
            setTimeout(() => {
              setTargetVisible(true)
              setTargetItemScale(3)
            }, 60 * 1000)
          } else {
            setTargetItemScale(spriteRef?.current?.scale.x * 0.99)
          }
        }}
      />
      {targetVisible && (
        <TargetHeart
          isClickThrough={true}
          scale={targetItemScale}
          border={miniCatBorder}
          defaultX={getRandomInt(100, 1500)}
          defaultY={-20}
          ref={spriteRef}
        />
      )}
      <EndBtn
        isClickThrouth={true}
        handleClick={handleClickToHome}
        x={1800}
        y={1000}
        scale={1}
      />
    </Layout>
  )
}

export default ConcentratePage
