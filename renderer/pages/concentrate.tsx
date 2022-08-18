import styled from 'styled-components'
import { Stage, Sprite } from '@inlet/react-pixi'
import { useState } from 'react'

import Layout from '../components/Layout'
import Timer from '../components/Timer'

const ConcentratePage = () => {
  let [time, setTime] = useState('00:00:00')
  const handleStopClick = () => {
    console.log(time)
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
        <Sprite image="/img/cat.gif" x={450} y={350} scale={2} />
      </StyledStage>
      <StyledA onClick={handleStopClick}>終了</StyledA>
    </Layout>
  )
}

const StyledStage = styled(Stage)`
  width: 100% !important;
  height: 100% !important;
`

const StyledA = styled.a`
  font-size: 1.2rem;
  font-weight: 900;
  padding: 1rem 2rem;
  user-select: none;
  text-align: center;
  vertical-align: middle;
  text-decoration: none;
  color: #455d55;
  background-color: #4cfcbe;
  border-radius: 1.3rem;
  border: 5px solid white;
  position: absolute;
  right: 5%;
  bottom: 5%;
  &:hover {
    opacity: 0.8;
  }
`

export default ConcentratePage
