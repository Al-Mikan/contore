import styled from 'styled-components'
import { Stage } from '@inlet/react-pixi'
import { useState, MouseEventHandler } from 'react'
import { useDisclosure } from '@chakra-ui/react'
import Image from 'next/image'
import { FaRegHandPaper } from 'react-icons/fa'

import Layout from '../components/Layout'
import Timer from '../components/Timer'
import ResultModal from '../components/ResultModal'
import MiniCat from '../components/characters/MiniCat'

const ConcentratePage = () => {
  let [time, setTime] = useState('00:00:00')
  let [resultTime, setResultTime] = useState('00:00:00')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const handleStopClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()
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
      </StyledStage>
      <DragButton>
        <FaRegHandPaper />
      </DragButton>
      <StyledImageButton onClick={handleStopClick}>
        <Image src="/img/end-btn.png" layout="fill" />
      </StyledImageButton>

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

const StyledImageButton = styled.button`
  position: absolute;
  right: 5%;
  bottom: 2%;
  width: 13%;
  height: 10%;
  &:hover {
    opacity: 0.6;
  }
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
