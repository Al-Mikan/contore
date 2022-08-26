import styled from 'styled-components'
import { useRouter } from 'next/router'
import { InteractionEvent } from 'pixi.js'

import Canvas from '../components/Canvas'
import Layout from '../components/Layout'
import StartBtn from '../components/buttons/StartBtn'
import Bg from '../components/Bg'
import Bar from '../components/Bars'
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
          <Bg />
          <Bar n="1" />
          <StartBtn handleStartClick={handleStartClick} />
          <MiniCat isClickThrough={false} />
          <Level level="100" />
          <Heart />
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
