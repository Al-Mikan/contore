import styled from 'styled-components'
import { useRouter } from 'next/router'
import { InteractionEvent } from 'pixi.js'

import Canvas from '../components/Canvas'
import Layout from '../components/Layout'
import StartBtn from '../components/StartBtn'

const IndexPage = () => {
  const router = useRouter()
  const handleStartClick: (event: InteractionEvent) => void = (event) => {
    router.push('/concentrate')
  }

  return (
    <Layout title="Home | こんとれ！！">
      <Container>
        <Canvas>
          <StartBtn handleStartClick={handleStartClick} />
        </Canvas>
      </Container>
    </Layout>
  )
}

const Container = styled.div`
  background-color: rgba(255, 255, 255, 0.8);
  width: 100vw;
  height: 100vh;
`

export default IndexPage
