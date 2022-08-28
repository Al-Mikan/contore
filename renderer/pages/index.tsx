import styled from 'styled-components'
import { useRouter } from 'next/router'
import { InteractionEvent } from 'pixi.js'

import Canvas from '../components/Canvas'
import Layout from '../components/Layout'
import StartBtn from '../components/buttons/StartBtn'
import Background from '../components/Background'
import LevelBar from '../components/LevelBar'
import MiniCat from '../components/characters/MiniCat'
import Level from '../components/Level'
import Heart from '../components/hearts'

const IndexPage = () => {
  const router = useRouter()
  const handleStartClick: (event: InteractionEvent) => void = (event) => {
    router.push('/concentrate')
  }

  return (
    <Layout title="Home | こんとれ！！">
      <Container>
        <Canvas>
          <Background />
          <LevelBar n={1} x={1500} y={80} scale={2} />
          <StartBtn
            handleStartClick={handleStartClick}
            x={1600}
            y={900}
            scale={2}
          />
          <Level level={20} x={1300} y={80} />
          <MiniCat isClickThrough={false} />
        </Canvas>
      </Container>
    </Layout>
  )
}

const Container = styled.div`
  background-color: rgba(255, 255, 255, 1);
  width: 100vw;
  height: 100vh;
`

export default IndexPage
