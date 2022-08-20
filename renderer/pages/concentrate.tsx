import styled from 'styled-components'
import { Stage } from '@inlet/react-pixi'
import { useState } from 'react'
import { useDisclosure } from '@chakra-ui/react'
import { FaRegHandPaper } from 'react-icons/fa'

import Layout from '../components/Layout'
import Timer from '../components/Timer'
import ResultModal from '../components/ResultModal'
import MiniCat from '../components/characters/MiniCat'
import EndBtn from '../components/EndBtn'
import { InteractionEvent } from 'pixi.js'

const ConcentratePage = () => {
  let [time, setTime] = useState('00:00:00')
  let [resultTime, setResultTime] = useState('00:00:00')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const handleStopClick: (event: InteractionEvent) => void = (event) => {
    setResultTime(time)
    onOpen()
  }

  return (
    <Layout title="集中画面 | こんとれ！！">
      <StyledStage height={1080} width={1920} options={{ backgroundAlpha: 0 }}>
        <Timer
          time={time}
          setTime={(v) => {
            setTime(v)
          }}
        />
        <MiniCat />
        <EndBtn handleStopClick={handleStopClick} />
      </StyledStage>
      <DragButton>
        <FaRegHandPaper />
      </DragButton>

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

const DragButton = styled.a`
  font-size: 1rem;
  font-weight: 900;
  padding: 0.3rem 0.3rem;
  user-select: none;
  text-align: center;
  vertical-align: middle;
  text-decoration: none;
  color: #455d55;
  background-color: #4cfcbe;
  border-radius: 0.5rem;
  border: 1px solid white;
  position: absolute;
  right: 1%;
  top: 1%;
  -webkit-app-region: drag;
`

export default ConcentratePage
