import { PixiRef, Sprite, Text } from '@inlet/react-pixi'
import { useRouter } from 'next/router'
import { InteractionEvent, TextStyle } from 'pixi.js'
import { useContext, useEffect, useRef, useState } from 'react'

import EndBtn from '../components/buttons/EndBtn'
import FishBtn from '../components/buttons/FIshBtn'
import MiniCat from '../components/characters/MiniCat'
import TargetFish from '../components/characters/TargetFish'
import { GameContext } from '../components/containers/CanvasContext'
import CuteFish from '../components/items/CuteFish'
import LifeGauge from '../components/items/LifeGauge'
import useAudioDidMounted from '../hooks/useAudioDidMounted'
import HealthPoint from '../utils/HealthPoint'
import { getRandomInt } from '../utils/common'

type ISprite = PixiRef<typeof Sprite>

const Feed = () => {
  const router = useRouter()
  useAudioDidMounted('/static/sounds/bgm.mp3')
  const { health, plusHealthInStateAndDB, fish, plusFishInStateAndDB } =
    useContext(GameContext)
  const spriteRef = useRef<ISprite>(null)
  const [targetItemScale, setTargetItemScale] = useState(0.2)
  const [targetVisible, setTargetVisible] = useState(false)
  const [minicatScale, setMinicatScale] = useState(0.6)
  const [spriteAnimationIndex, setSpriteAnimationIndex] = useState(0)
  const miniCatBorder = {
    minX: 40,
    maxX: 1900,
    minY: 30 + (minicatScale - 0.8) * 35, // スケール調整時に浮かないように
    maxY: 1050 - (minicatScale - 0.8) * 35,
    randomTargetMinX: 100,
    randomTargetMaxX: 1720,
  }

  const hp = new HealthPoint(health)

  const handleClickToHome = (event: InteractionEvent) => {
    router.push('/')
  }
  const handleClickFish = async (event: InteractionEvent) => {
    if (targetVisible) return
    if (fish <= 0) return

    await plusFishInStateAndDB(-1)
    setTargetVisible(true)
    setTargetItemScale(0.3)
  }

  useEffect(() => {
    window.electronAPI.setAlwaysOnTop(true)

    return () => {
      window.electronAPI.setAlwaysOnTop(false)
    }
  }, [])

  return (
    <>
      <MiniCat
        isClickThrough={true}
        scale={minicatScale}
        border={miniCatBorder}
        defaultX={950}
        defaultY={miniCatBorder.maxY}
        targetSpriteRef={spriteRef}
        handleTargetCollision={() => {
          setSpriteAnimationIndex((prev) => {
            const index = prev + 1
            const end = 4
            if (index === end) {
              setTargetVisible(false)
              plusHealthInStateAndDB(Math.floor(HealthPoint.MAX_TIME / 10)) // ハート一つ分
              return 0
            }
            return index
          })
        }}
      />
      {targetVisible && (
        <TargetFish
          isClickThrough={true}
          scale={targetItemScale}
          border={miniCatBorder}
          defaultX={getRandomInt(100, 1500)}
          defaultY={20}
          ref={spriteRef}
          spriteAnimationIndex={spriteAnimationIndex}
        />
      )}
      <EndBtn
        isClickThrouth={true}
        handleClick={handleClickToHome}
        x={1785}
        y={1000}
        scale={1}
      />
      <FishBtn
        isClickThrouth={true}
        x={1776}
        y={950}
        scale={0.5}
        isZero={fish <= 0}
        handleClick={handleClickFish}
      />
      <CuteFish x={1795} y={928} scale={0.2} />
      <Text
        text={`× ${fish}`}
        x={1835}
        y={910}
        style={
          fish <= 0
            ? new TextStyle({
                fontSize: 25,
                fontWeight: '700',
                fontFamily: 'neue-pixel-sans',
                fill: '#ff0000',
              })
            : new TextStyle({
                fontSize: 25,
                fontWeight: '700',
                fontFamily: 'neue-pixel-sans',
                fill: '#ffffff',
              })
        }
      />
      <LifeGauge
        n={hp.get_health_point_formatted(10)}
        x={1765}
        y={880}
        scale={0.7}
      />
    </>
  )
}

export default Feed
