import Layout from '../components/Layout'
import Link from 'next/link'
import styled from 'styled-components'
import { Stage, Sprite } from '@inlet/react-pixi'

import Timer from '../components/Timer'

const ConcentratePage = () => {
  return (
    <Layout title="集中画面 | こんとれ！！">
      <Stage height={1000} width={2000} options={{ backgroundAlpha: 0 }}>
        <Timer />
        <Sprite image="/img/cat.gif" x={350} y={250} />
      </Stage>
      <Link href="/">
        <StyledA>終了</StyledA>
      </Link>
    </Layout>
  )
}

const StyledA = styled.a`
  font-size: 1.2rem;
  font-weight: 900;
  padding: 1rem 2rem;
  cursor: pointer;
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
