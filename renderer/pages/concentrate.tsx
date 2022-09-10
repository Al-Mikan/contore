import { useEffect, useState, useRef } from 'react'
import { InteractionEvent } from 'pixi.js'

import Layout from '../components/containers/Layout'
import Timer from '../components/items/Timer'
import ResultModal from '../components/modals/ResultModal'
import MiniCat from '../components/characters/MiniCat'
import EndBtn from '../components/buttons/EndBtn'
import { useRouter } from 'next/router'
import { shouldStrTimeToSecondNum } from '../utils/api'
import ExperiencePoint from '../utils/ExperiencePoint'
import CameraHandle from '../utils/camera'

const timeToCoins = (time: string) => {
  // ここは時間に応じて取得枚数を変える
  return 10
}

const ConcentratePage = () => {
  const router = useRouter()
  let [time, setTime] = useState('00:00:00')
  let [resultTime, setResultTime] = useState('00:00:00')
  let [isOpen, setIsOpen] = useState(false)
  let cameraHandleRef = useRef<CameraHandle>(null)

  const miniCatBorder = {
    minX: 0,
    maxX: 1850,
    minY: 30,
    maxY: 1050,
    randomTargetMinX: 1400,
    randomTargetMaxX: 1620,
  }

  const canUseCamera = async () => {
    const camera_flag: boolean = await window.database.read('setting.camera')
    return camera_flag
  }

  const camera_confirmer = async () => {
    const once_asked = localStorage.getItem('once_asked')
    // 初回のみ
    if (!once_asked) {
      const res = await window.electronAPI.camera_confirm()
      if (res) {
        window.localStorage.setItem('once_asked', 'true')
        await window.database.update('setting.camera', true)
      } else {
        window.localStorage.setItem('once_asked', 'false')
        window.database.update('setting.camera', false)
      }
      return
    }
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

    // カメラを起動しない場合はインスタンスが存在しない
    if (cameraHandleRef.current) {
      cameraHandleRef.current.stop_camera()
      console.log(`score;${cameraHandleRef.current.cat_detect_ratio}`)
    }
  }
  const handleClickToHome = (event: InteractionEvent) => {
    router.push('/')
    event.stopPropagation() // modalにクリック判定を与えない
  }

  useEffect(() => {
    const cameraUse = async () => {
      await camera_confirmer()
      const cameraFlag = await canUseCamera()
      if (cameraFlag) {
        cameraHandleRef.current = new CameraHandle()
        cameraHandleRef.current.start_camera()
      }
    }

    cameraUse()
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
