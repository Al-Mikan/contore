import { useEffect, useState, useRef, useContext } from 'react'
import { NextRouter } from 'next/router'
import { Sprite, PixiRef, Text } from '@inlet/react-pixi'
import { InteractionEvent, TextStyle } from 'pixi.js'

import MiniCat from '../characters/MiniCat'
import LifeGauge from '../items/LifeGauge'
import TargetFish from '../characters/TargetFish'
import EndBtn from '../buttons/EndBtn'
import FishBtn from '../buttons/FIshBtn'
import CuteFish from '../items/CuteFish'
import { HealthContext } from '../containers/CanvasContext'
import { getRandomInt } from '../../utils/common'
import { shouldFetchFish, updateShopFish } from '../../utils/model'
import HealthPoint from '../../utils/HealthPoint'

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
    <>
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
            plusHealth(Math.floor(HealthPoint.MAX_TIME / 5)) // ハート一つ分
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
        x={1785}
        y={1000}
        scale={1}
      />
      <FishBtn
        isClickThrouth={true}
        x={1776}
        y={950}
        scale={0.5}
        handleClickFish={handleClickFish}
      />
      <CuteFish x={1795} y={928} scale={0.2} />
      <Text
        text={`× ${fish}`}
        x={1835}
        y={910}
        style={
          new TextStyle({
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
