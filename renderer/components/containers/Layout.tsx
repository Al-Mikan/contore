import React, { ReactNode } from 'react'
import Head from 'next/head'
import styled from 'styled-components'

import Canvas from './Canvas'

type Props = {
  children: ReactNode
  title?: string
}

const Layout = ({ children, title = 'こんとれ！！' }: Props) => (
  <StyledConteiner>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <Canvas>{children}</Canvas>
    <video
      id="video"
      style={{ visibility: 'hidden', width: '0px', height: '0px' }}
    />
    <canvas
      id="canvas"
      width="1280px"
      height="720px"
      style={{ zIndex: '100' }}
    />
  </StyledConteiner>
)

const StyledConteiner = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  /* 動作不安定のためoff */
  /* cursor: url('/static/img/mini-pad.png') 15 15, auto; */
`

export default Layout
