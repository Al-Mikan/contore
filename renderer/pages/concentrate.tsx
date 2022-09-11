import { useRouter } from 'next/router'
import { InteractionEvent } from 'pixi.js'
import { useEffect, useRef, useState } from 'react'

import EndBtn from '../components/buttons/EndBtn'
import MiniCat from '../components/characters/MiniCat'
import Layout from '../components/containers/Layout'
import Loading from '../components/items/Loading'
import Timer from '../components/items/Timer'
import ResultModal from '../components/modals/ResultModal'
import ExperiencePoint from '../utils/ExperiencePoint'
import CameraHandle from '../utils/camera'
import { shouldStrTimeToSecondNum } from '../utils/common'
import {
  shouldFetchCoins,
  shouldFetchExperience,
  updateCoreCoin,
  updateCoreEX,
} from '../utils/model'

const timeToCoins = (time: string) => {
  // 1分 -> 1枚
  const seconds = shouldStrTimeToSecondNum(time)
  return Math.floor(seconds / 60)
}

const ConcentratePage = () => {
  const router = useRouter()
  let [time, setTime] = useState('00:00:00')
  let [resultTime, setResultTime] = useState('00:00:00')
  let [isOpen, setIsOpen] = useState(false)
  let [isLoading, setIsLoading] = useState(true)
  const [minicatScale, setMinicatScale] = useState(0.6)
  let cameraHandleRef = useRef<CameraHandle>(null)

  const miniCatBorder = {
    minX: 40,
    maxX: 1900,
    minY: 30 + (minicatScale - 0.8) * 35, // スケール調整時に浮かないように
    maxY: 1050 - (minicatScale - 0.8) * 35,
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
      const nowEx = await shouldFetchExperience()
      const ex = new ExperiencePoint(nowEx)
      ex.add_point(shouldStrTimeToSecondNum(time))
      await updateCoreEX(ex.experience_point)
    }
    const updateCoins = async () => {
      const nowCoins = await shouldFetchCoins()
      await updateCoreCoin(nowCoins + timeToCoins(time))
    }

    // カメラを起動しない場合はインスタンスが存在しない
    if (cameraHandleRef.current) {
      cameraHandleRef.current.stop_camera()
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
    const cameraUse = async () => {
      await camera_confirmer()
      const cameraFlag = await canUseCamera()
      if (cameraFlag) {
        cameraHandleRef.current = new CameraHandle(setIsLoading)
        cameraHandleRef.current.start_camera()
      } else {
        setIsLoading(false)
      }
    }

    cameraUse()
    window.electronAPI.setAlwaysOnTop(true)
    return () => {
      window.electronAPI.setAlwaysOnTop(false)
    }
  }, [])

  if (isLoading) {
    return (
      <Layout title="集中画面｜こんとれ！！">
        <Loading x={1000} y={480} />
      </Layout>
    )
  }

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
          score={
            cameraHandleRef.current
              ? Math.ceil(cameraHandleRef.current.cat_detect_ratio)
              : -1
          }
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
