import { PixiRef, Sprite, Text } from '@inlet/react-pixi'
import { NextRouter } from 'next/router'
import { InteractionEvent, TextStyle } from 'pixi.js'
import { useContext, useEffect, useRef, useState } from 'react'

import HealthPoint from '../../utils/HealthPoint'
import { getRandomInt } from '../../utils/common'
import { shouldFetchFish, updateShopFish } from '../../utils/model'
import EndBtn from '../buttons/EndBtn'
import FishBtn from '../buttons/FIshBtn'
import MiniCat from '../characters/MiniCat'
import TargetFish from '../characters/TargetFish'
import { HealthContext } from '../containers/CanvasContext'
import CuteFish from '../items/CuteFish'
import LifeGauge from '../items/LifeGauge'

type ISprite = PixiRef<typeof Sprite>
interface Props {
  router: NextRouter
}

const UseContextPlay = ({ router }: Props) => {
  const { health, plusHealth } = useContext(HealthContext)
  const spriteRef = useRef<ISprite>(null)
  const [targetItemScale, setTargetItemScale] = useState(0.2)
  const [targetVisible, setTargetVisible] = useState(false)
  const [minicatScale, setMinicatScale] = useState(0.6)
  const [fish, setFish] = useState(0)
  const [spriteAnimationIndex, setSpriteAnimationIndex] = useState(0)
  const [isEmpty, setIsEmpty] = useState(false)
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
    if (fish <= 0) {
      setIsEmpty(true)
      return
    } else if (fish === 1) {
      setIsEmpty(true)
    }

    await updateShopFish(fish - 1)
    setFish((prev) => prev - 1)
    setTargetVisible(true)
    setTargetItemScale(0.3)
  }

  useEffect(() => {
    const stateInitFish = async () => {
      const fishNumber = await shouldFetchFish()
      if (fishNumber <= 0) setIsEmpty(true)
      setFish(fishNumber)
    }

    stateInitFish()
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
              plusHealth(Math.floor(HealthPoint.MAX_TIME / 10)) // ハート一つ分
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
        isZero={isEmpty}
        handleClickFish={handleClickFish}
      />
      <CuteFish x={1795} y={928} scale={0.2} />
      <Text
        text={`× ${fish}`}
        x={1835}
        y={910}
        style={
          isEmpty
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

export default UseContextPlay
