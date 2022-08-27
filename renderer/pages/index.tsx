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
          <LevelBar n={1} />
          <StartBtn handleStartClick={handleStartClick} />
          <Level level={20} />
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
