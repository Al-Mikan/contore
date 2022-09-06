import { useEffect, useState, useRef } from 'react'
import { Sprite, PixiRef } from '@inlet/react-pixi'
import { InteractionEvent } from 'pixi.js'

import Layout from '../components/containers/Layout'
import Timer from '../components/items/Timer'
import ResultModal from '../components/modals/ResultModal'
import MiniCat from '../components/characters/MiniCat'
import TargetHeart from '../components/characters/TargetHeart'
import EndBtn from '../components/buttons/EndBtn'
import { useRouter } from 'next/router'
import { getRandomInt, shouldStrTimeToSecondNum } from '../utils/api'
import ExperiencePoint from '../utils/ExperiencePoint'

type ISprite = PixiRef<typeof Sprite>

const timeToCoins = (time: string) => {
  // ここは時間に応じて取得枚数を変える
  return 10
}

const ConcentratePage = () => {
  const router = useRouter()
  const [time, setTime] = useState('00:00:00')
  const [resultTime, setResultTime] = useState('00:00:00')
  const [isOpen, setIsOpen] = useState(false)
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

  const handleClickOpenModal = (event: InteractionEvent) => {
    const updateExperience = async () => {
      const nowEx: number = await window.database.read('core.experience_point')
      if (nowEx === undefined) {
        throw new Error('electron-store: core.experience_pointが存在しません')
      }
      const ex = new ExperiencePoint(nowEx)
      ex.add_point(shouldStrTimeToSecondNum(time))
      await window.database.update('core.experience_point', ex.experience_point)
    }
    const updateCoins = async () => {
      const nowCoins: number = await window.database.read('core.coin')
      if (nowCoins === undefined) {
        throw new Error('electron-store: core.coinが存在しません')
      }
      await window.database.update('core.coin', nowCoins + timeToCoins(time))
    }

    updateExperience()
    updateCoins()

    setResultTime(time)
    setIsOpen(true)
  }
  const handleClickToHome = (event: InteractionEvent) => {
    router.push('/')
    event.stopPropagation() // modalにクリック判定を与えない
  }

  useEffect(() => {
    window.electronAPI.setAlwaysOnTop(true)

    return () => {
      window.electronAPI.setAlwaysOnTop(false)
    }
  }, [])

  return (
    <Layout title="集中画面 | こんとれ！！">
      {isOpen ? (
        // endボタンを推すとモーダル表示
        <ResultModal
          x={910}
          y={520}
          scale={1.5}
          time={resultTime}
          coins={timeToCoins(time)}
          isOpen={isOpen}
          handleClickToHome={handleClickToHome}
        ></ResultModal>
      ) : (
        // 集中画面はモーダル表示時には出さない
        <>
          <Timer
            x={1790}
            y={970}
            scale={0.3}
            time={time}
            setTime={(v) => {
              setTime(v)
            }}
          />
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
            handleClick={handleClickOpenModal}
            x={1800}
            y={1000}
            scale={1}
          />
        </>
      )}
    </Layout>
  )
}

export default ConcentratePage
