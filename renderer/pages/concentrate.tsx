import { useEffect, useState } from 'react'
import { InteractionEvent } from 'pixi.js'

import Layout from '../components/Layout'
import Timer from '../components/Timer'
import ResultModal from '../components/ResultModal'
import MiniCat from '../components/characters/MiniCat'
import EndBtn from '../components/buttons/EndBtn'
import Canvas from '../components/Canvas'
import { useRouter } from 'next/router'

const ConcentratePage = () => {
  const router = useRouter()
  let [time, setTime] = useState('00:00:00')
  let [resultTime, setResultTime] = useState('00:00:00')
  let [isOpen, setIsOpen] = useState(false)
  const handleClickOpenModal = (event: InteractionEvent) => {
    setResultTime(time)
    setIsOpen(true)
  }
  const handleClickToHome = (event: InteractionEvent) => {
    router.push('/')
    event.stopPropagation() // modalにクリック判定を与えない
  }

  useEffect(() => {
    window.electronAPI.setWindowFullscreen()
    window.electronAPI.setAlwaysOnTop(true)

    return () => {
      window.electronAPI.setWindowCenter()
      window.electronAPI.setAlwaysOnTop(false)
    }
  }, [])

  return (
    <Layout title="集中画面 | こんとれ！！">
      <Canvas>
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
            <MiniCat isClickThrough={true} />
            <EndBtn
              handleClick={handleClickOpenModal}
              x={1800}
              y={1000}
              scale={1}
            />
          </>
        )}
      </Canvas>
    </Layout>
  )
}

export default ConcentratePage
