import { useEffect, useState } from 'react'
import { InteractionEvent } from 'pixi.js'

import Layout from '../components/containers/Layout'
import Timer from '../components/items/Timer'
import ResultModal from '../components/modals/ResultModal'
import MiniCat from '../components/characters/MiniCat'
import EndBtn from '../components/buttons/EndBtn'
import { useRouter } from 'next/router'
import { shouldStrTimeToSecondNum } from '../utils/api'
import ExperiencePoint from '../utils/ExperiencePoint'

const ConcentratePage = () => {
  const router = useRouter()
  let [time, setTime] = useState('00:00:00')
  let [resultTime, setResultTime] = useState('00:00:00')
  let [isOpen, setIsOpen] = useState(false)
  const miniCatBorder = {
    minX: 0,
    maxX: 1850,
    minY: 30,
    maxY: 1050,
    randomTargetMinX: 1400,
    randomTargetMaxX: 1620,
  }
  const handleClickOpenModal = (event: InteractionEvent) => {
    const func = async () => {
      const nowEx = await window.database.read('core.experience_point')
      if (nowEx === undefined) {
        throw new Error('electron-store: core.experience_pointが存在しません')
      }
      const ex = new ExperiencePoint(nowEx)
      ex.add_point(shouldStrTimeToSecondNum(time))
      await window.database.update('core.experience_point', ex.experience_point)
    }
    func()
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
            scale={0.8}
            border={miniCatBorder}
            defaultX={950}
            defaultY={1050}
          />
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
