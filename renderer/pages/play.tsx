import { useEffect, useState, useRef } from 'react'
import { Sprite, PixiRef, Text } from '@inlet/react-pixi'
import { InteractionEvent, TextStyle } from 'pixi.js'

import Layout from '../components/containers/Layout'
import MiniCat from '../components/characters/MiniCat'
import TargetFish from '../components/characters/TargetFish'
import EndBtn from '../components/buttons/EndBtn'
import { useRouter } from 'next/router'
import { getRandomInt } from '../utils/api'
import FishBtn from '../components/buttons/FIshBtn'
import { shouldFetchFish, updateShopFish } from '../utils/model'

type ISprite = PixiRef<typeof Sprite>

const ConcentratePage = () => {
  const router = useRouter()
  const spriteRef = useRef<ISprite>(null)
  const [targetItemScale, setTargetItemScale] = useState(0.2)
  const [targetVisible, setTargetVisible] = useState(false)
  const [minicatScale, setMinicatScale] = useState(0.6)
  const [fish, setFish] = useState(0)
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
  const handleClickFish = async (event: InteractionEvent) => {
    if (targetVisible) return
    if (fish <= 0) return

    await updateShopFish(fish - 1)
    setFish((prev) => prev - 1)
    setTargetVisible(true)
    setTargetItemScale(0.3)
  }

  useEffect(() => {
    const stateInitFish = async () => {
      setFish(await shouldFetchFish())
    }

    stateInitFish()
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
          } else {
            setTargetItemScale(spriteRef?.current?.scale.x * 0.99)
          }
        }}
      />
      {targetVisible && (
        <TargetFish
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
      <FishBtn
        isClickThrouth={true}
        x={1798}
        y={950}
        scale={0.8}
        handleClickFish={handleClickFish}
      />
      <Text
        text={`× ${fish}`}
        x={1815}
        y={920}
        style={
          new TextStyle({
            fontSize: 25,
            fontWeight: '700',
            fontFamily: 'neue-pixel-sans',
            fill: '#ffffff',
          })
        }
      />
    </Layout>
  )
}

export default ConcentratePage
