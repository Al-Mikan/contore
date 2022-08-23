import { useEffect, useState } from 'react'
import { useDisclosure } from '@chakra-ui/react'
import { InteractionEvent } from 'pixi.js'
import { useRouter } from 'next/router'

import Layout from '../components/Layout'
import Timer from '../components/Timer'
import ResultModal from '../components/ResultModal'
import MiniCat from '../components/characters/MiniCat'
import EndBtn from '../components/EndBtn'
import Canvas from '../components/Canvas'

const ConcentratePage = () => {
  const router = useRouter()
  let [time, setTime] = useState('00:00:00')
  let [resultTime, setResultTime] = useState('00:00:00')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const handleStopClick: (event: InteractionEvent) => void = (event) => {
    setResultTime(time)
    router.push('/')
    /* モーダルはpixiで実装する */
    // onOpen()
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
        {/* Timerは常に表示すると非常に重たい */}
        {/* <Timer
          time={time}
          setTime={(v) => {
            setTime(v)
          }}
        /> */}
        <MiniCat isClickThrough={true} />
        <EndBtn handleStopClick={handleStopClick} />
      </Canvas>

      <ResultModal
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        time={resultTime}
      ></ResultModal>
    </Layout>
  )
}

export default ConcentratePage
