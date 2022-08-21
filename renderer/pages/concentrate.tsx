import styled from 'styled-components'
import { Container, Sprite, Stage } from '@inlet/react-pixi'
import { useEffect, useState } from 'react'
import { useDisclosure } from '@chakra-ui/react'
import { FaRegHandPaper } from 'react-icons/fa'

import Layout from '../components/Layout'
import Timer from '../components/Timer'
import ResultModal from '../components/ResultModal'
import MiniCat from '../components/characters/MiniCat'
import EndBtn from '../components/EndBtn'
import { InteractionEvent } from 'pixi.js'
import { useRouter } from 'next/router'

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
    window.electronAPI.setWindowRightBottom()
    window.electronAPI.setAlwaysOnTop(true)

    return () => {
      window.electronAPI.setWindowCenter()
      window.electronAPI.setAlwaysOnTop(false)
    }
  }, [])

  return (
    <Layout title="集中画面 | こんとれ！！">
      <StyledStage height={1080} width={1920} options={{ backgroundAlpha: 0 }}>
        {/* <Sprite image="/img/background.png" height={1080} width={1920} /> */}
        <Timer
          time={time}
          setTime={(v) => {
            setTime(v)
          }}
        />
        <MiniCat />
        <EndBtn handleStopClick={handleStopClick} />
      </StyledStage>

      <ResultModal
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        time={resultTime}
      ></ResultModal>
    </Layout>
  )
}

const StyledStage = styled(Stage)`
  width: 100% !important;
  height: 100% !important;
`

export default ConcentratePage
