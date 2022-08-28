import { useEffect, useState } from 'react'
import { InteractionEvent } from 'pixi.js'
import { useRouter } from 'next/router'

import Layout from '../components/Layout'
import Timer from '../components/Timer'
import ResultModal from '../components/ResultModal'
import MiniCat from '../components/characters/MiniCat'
import EndBtn from '../components/buttons/EndBtn'
import Canvas from '../components/Canvas'

const ConcentratePage = () => {
  const router = useRouter()
  let [time, setTime] = useState('00:00:00')
  let [resultTime, setResultTime] = useState('00:00:00')
  let [isOpen, setIsOpen] = useState(false)
  const handleStopClick: (event: InteractionEvent) => void = (event) => {
    setResultTime(time)
    setIsOpen(true)
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
            setIsOpen={(flag: boolean) => setIsOpen(flag)}
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
              handleStopClick={handleStopClick}
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
